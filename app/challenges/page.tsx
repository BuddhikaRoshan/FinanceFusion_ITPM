"use client";
import Navbar from "@/components/Navbar";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast, Toaster } from "sonner";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { 
  CalendarIcon, 
  Loader2, 
  Plus, 
  Search, 
  Trophy,
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Users,
  Award
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";

interface Challenge {
  id: string;
  challenge: string;
  challengeEnd: Date | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  completed: boolean;
}

type ChallengeFormData = {
  id?: string;
  challenge: string;
  challengeEnd: Date | null;
};

const ChallengesPage = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [filteredChallenges, setFilteredChallenges] = useState<Challenge[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState<ChallengeFormData>({
    challenge: "",
    challengeEnd: null,
  });
  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch all challenges
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await fetch("/api/challenges");
        if (!response.ok) throw new Error("Failed to fetch challenges");
        const data = await response.json();
        setChallenges(data);

        setFilteredChallenges(
          data.filter(
            (challenge: Challenge) =>
              challenge.userId === localStorage.getItem("userId")
          )
        );
        setChallenges(
          data.filter(
            (challenge: Challenge) =>
              challenge.userId === localStorage.getItem("userId")
          )
        );
      } catch (error) {
        toast.error("Error loading challenges");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  // Filter challenges based on search term
  useEffect(() => {
    const filtered = challenges.filter((challenge) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        challenge.challenge.toLowerCase().includes(searchLower) ||
        (challenge.challengeEnd &&
          format(new Date(challenge.challengeEnd), "PPP")
            .toLowerCase()
            .includes(searchLower))
      );
    });
    setFilteredChallenges(filtered);
  }, [searchTerm, challenges]);

  // Generate AI challenges
  const generateChallenges = async () => {
    setIsGenerating(true);
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("User ID not found");

      const response = await fetch("/api/openai-challenge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) throw new Error("Failed to generate challenges");

      const generatedChallenges = await response.json();
      toast.success("Generated new challenges successfully");
      setChallenges((prev) => [...generatedChallenges, ...prev]);
    } catch (error) {
      toast.error("Error generating challenges");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!currentChallenge.challenge.trim()) {
      toast.error("Challenge description is required");
      return;
    }

    try {
      setIsLoading(true);
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("User ID not found");

      const payload = {
        challenge: currentChallenge.challenge,
        userId,
        challengeEnd: currentChallenge.challengeEnd?.toISOString() || null,
      };

      let response: Response;
      let isUpdate = false;

      if (isEditMode && currentChallenge.id) {
        // Update existing challenge
        response = await fetch(`/api/challenges/${currentChallenge.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        isUpdate = true;
      } else {
        // Create new challenge
        response = await fetch("/api/challenges", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok)
        throw new Error(isUpdate ? "Update failed" : "Creation failed");

      await response.json();
      toast.success(
        isUpdate
          ? "Challenge updated successfully"
          : "Challenge created successfully"
      );

      const responseChallenge = await fetch("/api/challenges");
      if (!responseChallenge.ok) throw new Error("Failed to fetch challenges");
      const data = await responseChallenge.json();
      setChallenges(
        data.filter(
          (challenge: Challenge) =>
            challenge.userId === localStorage.getItem("userId")
        )
      );
      setFilteredChallenges(
        data.filter(
          (challenge: Challenge) =>
            challenge.userId === localStorage.getItem("userId")
        )
      );
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(
        isEditMode ? "Error updating challenge" : "Error creating challenge"
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/challenges/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Delete failed");

      toast.success("Challenge deleted successfully");
      setChallenges((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      toast.error("Error deleting challenge");
      console.error(error);
    }
  };

  // Reset form
  const resetForm = () => {
    setCurrentChallenge({
      challenge: "",
      challengeEnd: null,
    });
    setIsEditMode(false);
  };

  // Open edit dialog
  const openEditDialog = (challenge: Challenge) => {
    setCurrentChallenge({
      id: challenge.id,
      challenge: challenge.challenge,
      challengeEnd: challenge.challengeEnd
        ? new Date(challenge.challengeEnd)
        : null,
    });
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const completeChallenge = async (challenge: Challenge) => {
    try {
      await fetch("/api/challenges/" + challenge.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: true,
        }),
      });
      toast.success("Challenge successfull,congrats you earned 10 points");
      const responseChallenge = await fetch("/api/challenges");
      if (!responseChallenge.ok) throw new Error("Failed to fetch challenges");
      const data = await responseChallenge.json();
      setChallenges(
        data.filter(
          (challenge: Challenge) =>
            challenge.userId === localStorage.getItem("userId")
        )
      );
      setFilteredChallenges(
        data.filter(
          (challenge: Challenge) =>
            challenge.userId === localStorage.getItem("userId")
        )
      );
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Error while completing the challenge");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      <Toaster richColors position="top-right" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Financial Challenges
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Take control of your financial future with personalized challenges and rewards
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Trophy className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Active Challenges</p>
                <p className="text-2xl font-bold text-white">{filteredChallenges.filter(c => !c.completed).length}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Completed</p>
                <p className="text-2xl font-bold text-white">{filteredChallenges.filter(c => c.completed).length}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <Award className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Points</p>
                <p className="text-2xl font-bold text-white">{filteredChallenges.filter(c => c.completed).length * 10}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8"
        >
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search challenges..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
            />
          </div>
          <div className="flex gap-3">
            <Button
              onClick={generateChallenges}
              disabled={isGenerating}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500"
            >
              {isGenerating ? (
                <div className="flex items-center">
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Generating...
                </div>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  AI Suggestions
                </>
              )}
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Challenge
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white text-xl">
                    {isEditMode ? "Edit Challenge" : "Add New Challenge"}
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="challenge" className="text-white">
                      Challenge Description
                    </Label>
                    <Input
                      id="challenge"
                      name="challenge"
                      value={currentChallenge.challenge}
                      onChange={(e) =>
                        setCurrentChallenge((prev) => ({
                          ...prev,
                          challenge: e.target.value,
                        }))
                      }
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Enter your challenge description..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="challengeEnd" className="text-white">
                      End Date (Optional)
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal bg-gray-700 border-gray-600",
                            !currentChallenge.challengeEnd && "text-gray-400"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {currentChallenge.challengeEnd ? (
                            <p className="text-white">
                              {format(currentChallenge.challengeEnd, "PPP")}
                            </p>
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                        <Calendar
                          mode="single"
                          selected={currentChallenge.challengeEnd || undefined}
                          onSelect={(date) =>
                            setCurrentChallenge((prev) => ({
                              ...prev,
                              challengeEnd: date || null,
                            }))
                          }
                          initialFocus
                          className="bg-gray-800 text-white"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-gray-600 hover:bg-gray-700 text-black hover:text-black"
                    onClick={() => {
                      setIsDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500"
                    onClick={handleSubmit}
                  >
                    {isEditMode ? "Update" : "Save"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Challenges Table */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : filteredChallenges.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700"
          >
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-6">
              {searchTerm
                ? "No matching challenges found"
                : "No challenges created yet"}
            </p>
            <Button
              onClick={generateChallenges}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500"
            >
              Generate AI Suggestions
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden"
          >
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-gray-700">
                  <TableHead className="text-gray-300">Challenge</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">End Date</TableHead>
                  <TableHead className="text-gray-300">Created</TableHead>
                  <TableHead className="text-right text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredChallenges.map((challenge) => (
                  <motion.tr
                    key={challenge.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-gray-700 hover:bg-gray-700/30"
                  >
                    <TableCell className="font-medium text-white max-w-[300px] whitespace-normal break-words">
                      {challenge.challenge}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        challenge.completed 
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-blue-500/10 text-blue-400'
                      }`}>
                        {challenge.completed ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3 mr-1" />
                            In Progress
                          </>
                        )}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {challenge.challengeEnd
                        ? format(new Date(challenge.challengeEnd), "PPP")
                        : "No end date"}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {format(
                        new Date(challenge.createdAt ?? new Date().toDateString()),
                        "PP"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col sm:flex-row gap-2 justify-end">
                        {!challenge.completed && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-green-500/10 hover:bg-green-500/20 text-green-400 hover:text-green-300 border border-green-500/20 transition-colors duration-200 flex items-center gap-1.5 w-full sm:w-auto"
                            onClick={() => completeChallenge(challenge)}
                          >
                            <CheckCircle className="h-4 w-4" />
                            Complete
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 border border-blue-500/20 transition-colors duration-200 flex items-center gap-1.5 w-full sm:w-auto"
                          onClick={() => openEditDialog(challenge)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 transition-colors duration-200 flex items-center gap-1.5 w-full sm:w-auto"
                          onClick={() => handleDelete(challenge.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ChallengesPage;
