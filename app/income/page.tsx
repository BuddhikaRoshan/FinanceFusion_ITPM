"use client";
import Navbar from "@/components/Navbar";
import { getIncomesByUserId } from "@/services/income.service";
import { Income } from "@prisma/client";
import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { IncomeList } from "@/components/icomes/IncomeList";
import IncomeChartContainer from "@/components/icomes/IncomeChartContainer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const IncomesPage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"list" | "chart">("list");
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const storedUserId = localStorage.getItem("userId");
        if (!storedUserId) {
          setIsLoading(false);
          setError("User ID not found. Please log in again.");
          return;
        }

        setUserId(storedUserId);
        const fetchedIncomes = await getIncomesByUserId(storedUserId);
        setIncomes(fetchedIncomes);
      } catch (err) {
        console.error("Failed to fetch incomes:", err);
        setError("Failed to load incomes. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const memoizedIncomes = useMemo(() => incomes, [incomes]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading incomes...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error || !userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md p-6 bg-gray-800 rounded-xl shadow-xl"
          >
            <div className="bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded-lg">
              <p>{error || "User ID not found. Please log in again."}</p>
            </div>
            <button
              onClick={() => (window.location.href = "/login")}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              Go to Login
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black">
      <Navbar />
      <div className="container mx-auto p-4 md:p-8 lg:p-12">
        <Tabs defaultValue="list" className="mb-6">
          <TabsList className="bg-gray-700">
            <TabsTrigger
              value="list"
              onClick={() => setActiveTab("list")}
              className="text-gray-300"
            >
              Income List
            </TabsTrigger>
            <TabsTrigger
              value="chart"
              onClick={() => setActiveTab("chart")}
              className="text-gray-300"
            >
              Analytics
            </TabsTrigger>
          </TabsList>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-white mb-2">
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                My Incomes
              </span>
            </h1>
            <p className="text-gray-400">Track and analyze your earnings</p>
          </motion.div>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl p-4 md:p-6"
          >
            {activeTab === "list" ? (
              <IncomeList initialIncomes={memoizedIncomes} userId={userId} />
            ) : (
              <IncomeChartContainer initialIncomes={memoizedIncomes} />
            )}
          </motion.div>
        </Tabs>
      </div>
    </div>
  );
};

export default IncomesPage;
