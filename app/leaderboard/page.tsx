"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Trophy,
  Medal,
  Crown,
  Star,
  TrendingUp,
  Users,
  Award,
  ChevronUp,
  ChevronDown,
  Target,
  BarChart3
} from "lucide-react";

interface LeaderboardEntry {
  id: string;
  userId: string;
  username: string;
  points: number;
  rank: number;
  completedChallenges: number;
  streak: number;
}

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [timeFrame, setTimeFrame] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch("/api/leaderboard");
        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard data");
        }
        
        const data = await response.json();
        setLeaderboardData(data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        setError("Failed to load leaderboard data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // Filter data based on timeFrame
  useEffect(() => {
    const fetchTimeFrameData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/leaderboard?timeFrame=${timeFrame}`);
        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard data");
        }
        
        const data = await response.json();
        setLeaderboardData(data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        setError("Failed to load leaderboard data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimeFrameData();
  }, [timeFrame]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-400" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return null;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "from-yellow-500 to-yellow-600";
      case 2:
        return "from-gray-400 to-gray-500";
      case 3:
        return "from-amber-600 to-amber-700";
      default:
        return "from-gray-700 to-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Leaderboard
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Compete with others and climb the ranks to become a financial champion
          </p>
        </motion.div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-8">
            <p className="text-red-400 text-center">{error}</p>
          </div>
        )}

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                <Trophy className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Participants</p>
                <p className="text-2xl font-bold text-white">{leaderboardData.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Target className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Points Awarded</p>
                <p className="text-2xl font-bold text-white">
                  {leaderboardData.reduce((sum, entry) => sum + entry.points, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Average Score</p>
                <p className="text-2xl font-bold text-white">
                  {Math.round(leaderboardData.reduce((sum, entry) => sum + entry.points, 0) / leaderboardData.length || 0)}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Time Frame Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-gray-800 rounded-xl p-2 inline-flex">
            <button
              onClick={() => setTimeFrame("week")}
              className={`px-6 py-3 rounded-lg transition-colors ${
                timeFrame === "week"
                  ? "bg-blue-500 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setTimeFrame("month")}
              className={`px-6 py-3 rounded-lg transition-colors ${
                timeFrame === "month"
                  ? "bg-blue-500 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setTimeFrame("all")}
              className={`px-6 py-3 rounded-lg transition-colors ${
                timeFrame === "all"
                  ? "bg-blue-500 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              All Time
            </button>
          </div>
        </motion.div>

        {/* Leaderboard Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden"
        >
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : leaderboardData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Trophy className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-400 text-lg">No data available yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="px-6 py-4 text-left text-gray-300 font-semibold">Rank</th>
                    <th className="px-6 py-4 text-left text-gray-300 font-semibold">User</th>
                    <th className="px-6 py-4 text-left text-gray-300 font-semibold">Points</th>
                    <th className="px-6 py-4 text-left text-gray-300 font-semibold">Challenges</th>
                    <th className="px-6 py-4 text-left text-gray-300 font-semibold">Streak</th>
                    <th className="px-6 py-4 text-left text-gray-300 font-semibold">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((entry, index) => (
                    <motion.tr
                      key={entry.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="border-b border-gray-700 hover:bg-gray-700/30"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          {getRankIcon(entry.rank)}
                          <span className={`text-lg font-semibold ${
                            entry.rank <= 3 ? "text-white" : "text-gray-300"
                          }`}>
                            #{entry.rank}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className={`h-10 w-10 rounded-full bg-gradient-to-r ${getRankColor(entry.rank)} flex items-center justify-center`}>
                            <span className="text-white font-semibold">
                              {entry.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-white font-medium">{entry.username}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Star className="h-5 w-5 text-yellow-400" />
                          <span className="text-white font-semibold">{entry.points}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Award className="h-5 w-5 text-blue-400" />
                          <span className="text-white">{entry.completedChallenges}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-5 w-5 text-green-400" />
                          <span className="text-white">{entry.streak} days</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1">
                          {index < 3 ? (
                            <ChevronUp className="h-5 w-5 text-green-400" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-red-400" />
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Top Performers Section */}
        {leaderboardData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {leaderboardData.slice(0, 3).map((entry, index) => (
              <div
                key={entry.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getRankIcon(entry.rank)}
                    <span className="text-xl font-bold text-white">#{entry.rank}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-400" />
                    <span className="text-white font-semibold">{entry.points} pts</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`h-16 w-16 rounded-full bg-gradient-to-r ${getRankColor(entry.rank)} flex items-center justify-center`}>
                    <span className="text-2xl text-white font-bold">
                      {entry.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{entry.username}</h3>
                    <p className="text-gray-400">{entry.completedChallenges} challenges completed</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-4 w-4" />
                    <span>{entry.streak} day streak</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Award className="h-4 w-4" />
                    <span>Top {index + 1}%</span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Leaderboard;