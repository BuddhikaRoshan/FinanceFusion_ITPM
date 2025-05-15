"use client";
import Navbar from "@/components/Navbar";
import { getIncomesByUserId } from "@/services/income.service";
import { Income } from "@prisma/client";
import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { IncomeList } from "@/components/icomes/IncomeList";
import IncomeChartContainer from "@/components/icomes/IncomeChartContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, Calendar, DollarSign, ArrowDownRight, Wallet } from "lucide-react";

const IncomePage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Calculate statistics
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const thisMonthIncomes = incomes.filter(
    (income) =>
      new Date(income.date).getMonth() === new Date().getMonth() &&
      new Date(income.date).getFullYear() === new Date().getFullYear()
  );
  const thisMonthTotal = thisMonthIncomes.reduce((sum, income) => sum + income.amount, 0);
  const lastMonthIncomes = incomes.filter(
    (income) => {
      const date = new Date(income.date);
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      return date.getMonth() === lastMonth.getMonth() && date.getFullYear() === lastMonth.getFullYear();
    }
  );
  const lastMonthTotal = lastMonthIncomes.reduce((sum, income) => sum + income.amount, 0);
  const monthOverMonthChange = lastMonthTotal ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0;
  const uniqueSources = new Set(incomes.map((income) => income.source)).size;

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Income Dashboard</h1>
              <p className="text-gray-400">Track and analyze your earnings</p>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar className="h-5 w-5" />
              <span>Last updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>

          {/* Income List Section - Moved to top */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Income Management</CardTitle>
            </CardHeader>
            <CardContent>
              <IncomeList initialIncomes={incomes} userId={userId} />
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total Income</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">LKR {totalIncome.toFixed(2)}</div>
                <p className="text-xs text-gray-400 mt-1">All time</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">LKR {thisMonthTotal.toFixed(2)}</div>
                <div className="flex items-center gap-2 mt-1">
                  {monthOverMonthChange >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-xs ${monthOverMonthChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {Math.abs(monthOverMonthChange).toFixed(1)}% vs last month
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Income Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{uniqueSources}</div>
                <p className="text-xs text-gray-400 mt-1">Different sources</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Average Monthly</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  LKR {(totalIncome / (incomes.length > 0 ? Math.ceil(incomes.length / 12) : 1)).toFixed(2)}
                </div>
                <p className="text-xs text-gray-400 mt-1">Per month</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Charts Section */}
            <div className="lg:col-span-2">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Income Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <IncomeChartContainer initialIncomes={incomes} />
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions */}
            <div className="lg:col-span-1">
              <Card className="bg-gray-800 border-gray-700 h-full">
                <CardHeader>
                  <CardTitle className="text-white">Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {incomes.slice(0, 5).map((income) => (
                      <div
                        key={income.id}
                        className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-500/10 rounded-lg">
                            <DollarSign className="h-5 w-5 text-blue-500" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{income.source}</p>
                            <p className="text-sm text-gray-400">
                              {new Date(income.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium">LKR {income.amount.toFixed(2)}</p>
                          <p className="text-sm text-gray-400">{income.type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomePage;