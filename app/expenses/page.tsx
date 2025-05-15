"use client";
import Navbar from "@/components/Navbar";
import { getExpensesByUserId } from "@/services/expense.service";
import { Expense } from "@prisma/client";
import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ExpenseList } from "@/components/expences/ExpenseList";
import ExpencesChartContainer from "@/components/expences/ExpenseChartContainer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, Calendar, DollarSign, ArrowDownRight, ShoppingCart } from "lucide-react";

const ExpensesPage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
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
        const fetchedExpenses = await getExpensesByUserId(storedUserId);
        setExpenses(fetchedExpenses);
      } catch (err) {
        console.error("Failed to fetch expenses:", err);
        setError("Failed to load expenses. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const memoizedExpenses = useMemo(() => expenses, [expenses]);

  // Calculate statistics
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const thisMonthExpenses = expenses.filter(
    (expense) =>
      new Date(expense.date).getMonth() === new Date().getMonth() &&
      new Date(expense.date).getFullYear() === new Date().getFullYear()
  );
  const thisMonthTotal = thisMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const lastMonthExpenses = expenses.filter(
    (expense) => {
      const date = new Date(expense.date);
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      return date.getMonth() === lastMonth.getMonth() && date.getFullYear() === lastMonth.getFullYear();
    }
  );
  const lastMonthTotal = lastMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const monthOverMonthChange = lastMonthTotal ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0;
  const uniqueCategories = new Set(expenses.map((expense) => expense.category)).size;

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
            <p className="text-gray-300">Loading expenses...</p>
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
              <h1 className="text-4xl font-bold text-white mb-2">Expense Dashboard</h1>
              <p className="text-gray-400">Track and analyze your spending habits</p>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar className="h-5 w-5" />
              <span>Last updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>

          {/* Expense List Section - Moved to top */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Expense Management</CardTitle>
            </CardHeader>
            <CardContent>
              <ExpenseList initialExpenses={expenses} userId={userId} />
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">LKR {totalExpenses.toFixed(2)}</div>
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
                  {monthOverMonthChange <= 0 ? (
                    <ArrowDownRight className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-xs ${monthOverMonthChange <= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {Math.abs(monthOverMonthChange).toFixed(1)}% vs last month
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{uniqueCategories}</div>
                <p className="text-xs text-gray-400 mt-1">Different categories</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Average Monthly</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  LKR {(totalExpenses / (expenses.length > 0 ? Math.ceil(expenses.length / 12) : 1)).toFixed(2)}
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
                  <CardTitle className="text-white">Expense Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <ExpencesChartContainer initialExpenses={expenses} />
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
                    {expenses.slice(0, 5).map((expense) => (
                      <div
                        key={expense.id}
                        className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-red-500/10 rounded-lg">
                            <ShoppingCart className="h-5 w-5 text-red-500" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{expense.category}</p>
                            <p className="text-sm text-gray-400">
                              {new Date(expense.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium">LKR {expense.amount.toFixed(2)}</p>
                          <p className="text-sm text-gray-400">{expense.description}</p>
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

export default ExpensesPage;