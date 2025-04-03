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
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Expense } from "@prisma/client";
import { Calendar, TrendingUp } from "lucide-react";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type ChartConfig } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#3b82f6", // blue-500
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa", // blue-400
  },
} satisfies ChartConfig;

// Utility function to filter expenses by time period
const filterExpensesByTimePeriod = (expenses: Expense[], period: string) => {
  const now = new Date();
  const currentDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  return expenses.filter((expense) => {
    // Ensure createdAt is a Date object
    const expenseDate = expense.createdAt instanceof Date 
      ? expense.createdAt 
      : new Date(expense.createdAt);
    
    // Calculate difference in milliseconds
    const diffTime = currentDate.getTime() - expenseDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    switch (period) {
      case "week":
        return diffDays <= 7 && diffDays >= 0;
      case "month":
        return diffDays <= 30 && diffDays >= 0;
      case "year":
        return diffDays <= 365 && diffDays >= 0;
      default:
        return true; // 'all' time
    }
  });
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

// Utility function to calculate total expenses
const calculateTotalExpenses = (expenses: Expense[]) => {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
};

interface ExpensesChartContainerProps {
  initialExpenses: Expense[];
}

const ExpensesChartContainer: React.FC<ExpensesChartContainerProps> = ({
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

  const totalExpenses = useMemo(
    () => calculateTotalExpenses(filteredExpenses),
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
              <span>Total: ${totalExpenses.toFixed(2)}</span>
              <span className="text-sm text-gray-500">
                ({filteredExpenses.length} records)
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="bar">
          <TabsList className="mb-4 bg-gray-700">
            <TabsTrigger value="bar" className="text-gray-300">
              Bar Chart
            </TabsTrigger>
            <TabsTrigger value="pie" className="text-gray-300">
              Pie Chart
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bar">
            <ChartContainer config={chartConfig}>
              <BarChart data={categorizedExpenses}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="category"
                  stroke="#9ca3af"
                  tick={{ fill: "#d1d5db" }}
                />
                <YAxis
                  stroke="#9ca3af"
                  tick={{ fill: "#d1d5db" }}
                  tickFormatter={(value) => `$${value}`}
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
                                ${payload[0].payload.totalAmount.toFixed(2)}
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
                  verticalAlign="top"
                  height={36}
                  wrapperStyle={{ color: "#d1d5db" }}
                />
                <Bar
                  dataKey="totalAmount"
                  name="Amount"
                  fill="#9333ea"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="pie">
            <div className="flex flex-col items-center">
              <ChartContainer config={chartConfig}>
                <div className="w-full h-[500px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categorizedExpenses}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={150}
                        innerRadius={60}
                        fill="#8884d8"
                        dataKey="totalAmount"
                        nameKey="category"
                        label={renderCustomizedLabel}
                      >
                        {categorizedExpenses.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                            stroke="#1f2937"
                            strokeWidth={2}
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
                                      $
                                      {payload[0].payload.totalAmount.toFixed(
                                        2
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex flex-col col-span-2">
                                    <span className="text-[0.70rem] uppercase text-gray-400">
                                      Percentage
                                    </span>
                                    <span className="font-bold text-white">
                                      {(
                                        (payload[0].payload.totalAmount /
                                          totalExpenses) *
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
              </ChartContainer>
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
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ExpensesChartContainer;