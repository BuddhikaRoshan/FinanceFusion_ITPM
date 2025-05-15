import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Expense } from "@prisma/client";
import { TrendingUp, Calendar, BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Utility function to filter expenses by time period
const filterExpensesByTimePeriod = (expenses: Expense[], period: string) => {
  const now = new Date();
  const periods = {
    week: 7 * 24 * 60 * 60 * 1000,
    month: 30 * 24 * 60 * 60 * 1000,
    year: 365 * 24 * 60 * 60 * 1000,
  };

  if (period === "all") return expenses;

  const cutoff = new Date(now.getTime() - periods[period as keyof typeof periods]);
  return expenses.filter((expense) => new Date(expense.date) >= cutoff);
};

// Utility function to group expenses by category
const groupExpensesByCategory = (expenses: Expense[]) => {
  return expenses?.reduce((acc, expense) => {
    const existing = acc.find((item) => item.category === expense.category);
    if (existing) {
      existing.totalAmount += expense.amount;
    } else {
      acc.push({
        category: expense.category,
        totalAmount: expense.amount,
      });
    }
    return acc;
  }, [] as Array<{ category: string; totalAmount: number }>);
};

// Utility function to group expenses by month
const groupExpensesByMonth = (expenses: Expense[]) => {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  
  const monthlyData = months.map(month => ({
    month,
    amount: 0
  }));

  expenses.forEach(expense => {
    const date = new Date(expense.date);
    const monthIndex = date.getMonth();
    monthlyData[monthIndex].amount += expense.amount;
  });

  return monthlyData;
};

// Utility function to calculate total expense
const calculateTotalExpense = (expenses: Expense[]) => {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
};

interface ExpenseChartContainerProps {
  initialExpenses: Expense[];
}

const ExpenseChartContainer: React.FC<ExpenseChartContainerProps> = ({
  initialExpenses,
}) => {
  const [timePeriod, setTimePeriod] = useState<string>("all");
  
  // Filter expenses based on selected time period
  const filteredExpenses = useMemo(() => {
    return filterExpensesByTimePeriod(initialExpenses ?? [], timePeriod);
  }, [initialExpenses, timePeriod]);

  // Memoize expensive calculations
  const categorizedExpenses = useMemo(
    () => groupExpensesByCategory(filteredExpenses),
    [filteredExpenses]
  );

  const monthlyExpenses = useMemo(
    () => groupExpensesByMonth(filteredExpenses),
    [filteredExpenses]
  );

  const totalExpense = useMemo(
    () => calculateTotalExpense(filteredExpenses),
    [filteredExpenses]
  );

  const COLORS = ["#3b82f6", "#9333ea", "#60a5fa", "#a855f7", "#c084fc"];

  // Custom label renderer for pie chart
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="w-full bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-white" />
              <span className="text-white">Expense Overview</span>
            </CardTitle>
            <div className="flex items-center gap-4">
              <Select value={timePeriod} onValueChange={setTimePeriod}>
                <SelectTrigger className="w-[120px] bg-gray-700 border-gray-600 text-gray-300">
                  <SelectValue placeholder="Time Period" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-gray-300">
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="week">Last Week</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>Total: LKR {totalExpense.toFixed(2)}</span>
                <span className="text-sm text-gray-500">
                  ({filteredExpenses.length} records)
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pie" className="space-y-4">
            <TabsList className="bg-gray-700/50 p-1 rounded-xl w-full md:w-auto">
              <TabsTrigger
                value="pie"
                className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-300 rounded-lg px-6 py-2.5 text-base font-medium transition-all duration-200"
              >
                <PieChartIcon className="w-4 h-4 mr-2" />
                Category Distribution
              </TabsTrigger>
              <TabsTrigger
                value="category-bar"
                className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-300 rounded-lg px-6 py-2.5 text-base font-medium transition-all duration-200"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Category Breakdown
              </TabsTrigger>
              <TabsTrigger
                value="bar"
                className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-300 rounded-lg px-6 py-2.5 text-base font-medium transition-all duration-200"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Monthly Trends
              </TabsTrigger>
              <TabsTrigger
                value="line"
                className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-300 rounded-lg px-6 py-2.5 text-base font-medium transition-all duration-200"
              >
                <LineChartIcon className="w-4 h-4 mr-2" />
                Expense Progression
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pie" className="mt-6">
              <div className="space-y-4">
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categorizedExpenses}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="totalAmount"
                      >
                        {categorizedExpenses.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg border border-gray-700 bg-gray-800 p-2 shadow-sm">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="flex flex-col">
                                    <span className="text-[0.70rem] uppercase text-gray-400">
                                      Category
                                    </span>
                                    <span className="font-bold text-white">
                                      {payload[0].payload.category}
                                    </span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-[0.70rem] uppercase text-gray-400">
                                      Amount
                                    </span>
                                    <span className="font-bold text-white">
                                      LKR {payload[0].payload.totalAmount.toFixed(2)}
                                    </span>
                                  </div>
                                  <div className="flex flex-col col-span-2">
                                    <span className="text-[0.70rem] uppercase text-gray-400">
                                      Percentage
                                    </span>
                                    <span className="font-bold text-white">
                                      {(
                                        (payload[0].payload.totalAmount /
                                          totalExpense) *
                                        100
                                      ).toFixed(2)}
                                      %
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend
                        wrapperStyle={{
                          color: "#d1d5db",
                          paddingTop: "20px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {categorizedExpenses.map((item, index) => (
                    <div key={item.category} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm text-gray-300">
                        {item.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="category-bar" className="mt-6">
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categorizedExpenses}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      type="number"
                      stroke="#9ca3af"
                      tick={{ fill: "#d1d5db" }}
                      tickFormatter={(value) => `LKR ${value}`}
                    />
                    <YAxis
                      type="category"
                      dataKey="category"
                      stroke="#9ca3af"
                      tick={{ fill: "#d1d5db" }}
                      width={100}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border border-gray-700 bg-gray-800 p-2 shadow-sm">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-gray-400">
                                    Category
                                  </span>
                                  <span className="font-bold text-white">
                                    {payload[0].payload.category}
                                  </span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-gray-400">
                                    Amount
                                  </span>
                                  <span className="font-bold text-white">
                                    LKR {payload[0].payload.totalAmount.toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex flex-col col-span-2">
                                  <span className="text-[0.70rem] uppercase text-gray-400">
                                    Percentage
                                  </span>
                                  <span className="font-bold text-white">
                                    {(
                                      (payload[0].payload.totalAmount /
                                        totalExpense) *
                                      100
                                    ).toFixed(2)}
                                    %
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar
                      dataKey="totalAmount"
                      name="Category Amount"
                      fill="#3b82f6"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="bar" className="mt-6">
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyExpenses}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="month"
                      stroke="#9ca3af"
                      tick={{ fill: "#d1d5db" }}
                    />
                    <YAxis
                      stroke="#9ca3af"
                      tick={{ fill: "#d1d5db" }}
                      tickFormatter={(value) => `LKR ${value}`}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border border-gray-700 bg-gray-800 p-2 shadow-sm">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-gray-400">
                                    Month
                                  </span>
                                  <span className="font-bold text-white">
                                    {payload[0].payload.month}
                                  </span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-gray-400">
                                    Amount
                                  </span>
                                  <span className="font-bold text-white">
                                    LKR {payload[0].payload.amount.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar
                      dataKey="amount"
                      name="Monthly Expenses"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="line" className="mt-6">
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyExpenses}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="month"
                      stroke="#9ca3af"
                      tick={{ fill: "#d1d5db" }}
                    />
                    <YAxis
                      stroke="#9ca3af"
                      tick={{ fill: "#d1d5db" }}
                      tickFormatter={(value) => `LKR ${value}`}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border border-gray-700 bg-gray-800 p-2 shadow-sm">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-gray-400">
                                    Month
                                  </span>
                                  <span className="font-bold text-white">
                                    {payload[0].payload.month}
                                  </span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-gray-400">
                                    Amount
                                  </span>
                                  <span className="font-bold text-white">
                                    LKR {payload[0].payload.amount.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      name="Expense Trend"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: "#3b82f6", strokeWidth: 2 }}
                      activeDot={{ r: 8, fill: "#3b82f6" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">LKR {totalExpense.toFixed(2)}</div>
            <p className="text-xs text-gray-400 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Average Monthly Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              LKR {(totalExpense / (monthlyExpenses.filter(m => m.amount > 0).length || 1)).toFixed(2)}
            </div>
            <p className="text-xs text-gray-400 mt-1">Per month</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Expense Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{categorizedExpenses.length}</div>
            <p className="text-xs text-gray-400 mt-1">Different categories</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExpenseChartContainer; 