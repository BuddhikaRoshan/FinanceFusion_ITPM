"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Mic, StopCircle } from "lucide-react";
import { toast } from "sonner";

interface VoiceInputModalIncomeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDataReceived: (data: {
    amount: number;
    source: string;
    date: Date;
  }) => void;
}

export const VoiceInputModalIncome = ({
  open,
  onOpenChange,
  onDataReceived,
}: VoiceInputModalIncomeProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      setAudioChunks([]);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((prev) => [...prev, event.data]);
        }
      };

      mediaRecorder.start(100);
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
      audioStreamRef.current = null;
    }
    setIsRecording(false);
  };

  const processAudio = async () => {
    if (audioChunks.length === 0) {
      toast.error("No audio recorded. Please try again.");
      return;
    }

    setIsProcessing(true);
    try {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("file", audioBlob, "recording.webm");
      formData.append("model", "whisper-1");

      // First transcribe the audio
      const transcriptionResponse = await fetch("/api/transcribe-audio", {
        method: "POST",
        body: formData,
      });

      if (!transcriptionResponse.ok) {
        throw new Error("Failed to transcribe audio");
      }

      const { transcript, error: transcriptionError } =
        await transcriptionResponse.json();

      if (transcriptionError) {
        throw new Error(transcriptionError);
      }

      if (!transcript) {
        throw new Error("No transcript returned from API");
      }

      // Then process for income data
      const processingResponse = await fetch("/api/process-voice-income", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transcript }),
      });

      if (!processingResponse.ok) {
        throw new Error("Failed to process transcript");
      }

      const data = await processingResponse.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const processedData = {
        ...data,
        date: new Date(data.date),
      };

      onDataReceived(processedData);
      onOpenChange(false);
      toast.success("Income data extracted successfully!");
    } catch (error) {
      console.error("Error processing audio:", error);
      toast.error(
        "Failed to process audio: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    } finally {
      setIsProcessing(false);
      setAudioChunks([]);
    }
  };

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Voice Income Input</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-gray-700 rounded-lg min-h-32 flex items-center justify-center">
            {isRecording ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-1 bg-green-500 animate-pulse"></div>
                <div className="h-6 w-1 bg-green-500 animate-pulse"></div>
                <div className="h-4 w-1 bg-green-500 animate-pulse"></div>
                <span className="text-gray-300">Recording...</span>
              </div>
            ) : (
              <p className="text-gray-400 italic">
                {audioChunks.length > 0
                  ? "Audio recorded. Ready to process."
                  : "Press the microphone button to start recording"}
              </p>
            )}
          </div>

          <div className="flex justify-center">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              variant={isRecording ? "destructive" : "default"}
              className="gap-2"
            >
              {isRecording ? (
                <>
                  <StopCircle className="h-4 w-4" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4" />
                  Start Recording
                </>
              )}
            </Button>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                setAudioChunks([]);
              }}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={processAudio}
              disabled={isRecording || audioChunks.length === 0 || isProcessing}
              className="bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
