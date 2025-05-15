"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { incomeSchema } from "@/schemas/income.schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Mic } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { VoiceInputModalIncome } from "./VoiceInputModalIncome";

type FormValues = z.infer<typeof incomeSchema>;

interface IncomeFormProps {
  onSubmit: (data: z.infer<typeof incomeSchema>) => void;
  defaultValues?: Partial<z.infer<typeof incomeSchema>>;
  userId: string;
}

export const IncomeForm = ({
  onSubmit,
  defaultValues,
  userId,
}: IncomeFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const preparedDefaults: Partial<FormValues> = {
    ...defaultValues,
    date: defaultValues?.date ? new Date(defaultValues.date) : undefined,
    userId: defaultValues?.userId ?? userId,
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(incomeSchema),
    defaultValues: preparedDefaults,
  });

  const handleSubmit = async (data: FormValues) => {
    try {
      setError(null);
      await onSubmit({
        ...data,
        userId: userId,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
  };

  return (
    <>
      <Form {...form}>
        <DialogTitle className="mb-4 text-white">
          {defaultValues ? "Edit Income" : "Add New Income"}
        </DialogTitle>

        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.valueAsNumber || 0)
                    }
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="source"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Source</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Salary, Freelance"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-gray-300">Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-gray-700 border-gray-600 hover:bg-gray-600 text-white",
                          !field.value && "text-gray-400"
                        )}
                      >
                        {field.value
                          ? format(field.value, "PPP")
                          : "Pick a date"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-70" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-gray-700 bg-gray-800">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className="bg-gray-800 text-white"
                      styles={{
                        day: {
                          color: "#e5e7eb", // text-gray-200
                        },
                        nav_button: {
                          backgroundColor: "#374151", // bg-gray-700
                          color: "#f3f4f6", // text-gray-100
                        },
                        head_cell: {
                          color: "#9ca3af", // text-gray-400
                        },
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          {/* Hidden field for userId */}
          <input type="hidden" {...form.register("userId")} value={userId} />

          <DialogFooter>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white"
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
      <Button
        type="button"
        onClick={() => setVoiceModalOpen(true)}
        variant="outline"
        className="mb-4 gap-2 bg-gray-700 text-white hover:bg-gray-600"
      >
        <Mic className="h-4 w-4" />
        Voice Input
      </Button>
      <VoiceInputModalIncome
        open={voiceModalOpen}
        onOpenChange={setVoiceModalOpen}
        onDataReceived={(data) => {
          form.setValue("amount", data.amount);
          form.setValue("source", data.source);
          form.setValue("date", data.date);
        }}
      />
    </>
  );
};
