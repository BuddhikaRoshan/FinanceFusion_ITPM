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
import { Income } from "@prisma/client";
import { TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Utility function to group incomes by source
const groupIncomesBySource = (incomes: Income[]) => {
  return incomes?.reduce((acc, income) => {
    const existing = acc.find((item) => item.source === income.source);
    if (existing) {
      existing.totalAmount += income.amount;
    } else {
      acc.push({
        source: income.source,
        totalAmount: income.amount,
      });
    }
    return acc;
  }, [] as Array<{ source: string; totalAmount: number }>);
};

// Utility function to calculate total incomes
const calculateTotalIncomes = (incomes: Income[]) => {
  return incomes.reduce((sum, income) => sum + income.amount, 0);
};

// Utility function to filter incomes by time period
const filterIncomesByTimePeriod = (incomes: Income[], period: string) => {
  const now = new Date();
  const currentDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  return incomes.filter((income) => {
    // Ensure createdAt is a Date object
    const incomeDate = income.createdAt instanceof Date 
      ? income.createdAt 
      : new Date(income.createdAt);
    
    // Calculate difference in milliseconds
    const diffTime = currentDate.getTime() - incomeDate.getTime();
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

interface IncomeChartContainerProps {
  initialIncomes: Income[];
}

const IncomeChartContainer: React.FC<IncomeChartContainerProps> = ({
  initialIncomes,
}) => {
  const [timePeriod, setTimePeriod] = useState<string>("all");
  
  // Filter incomes based on selected time period
  const filteredIncomes = useMemo(() => {
    return filterIncomesByTimePeriod(initialIncomes ?? [], timePeriod);
  }, [initialIncomes, timePeriod]);

  // Memoize expensive calculations
  const categorizedIncomes = useMemo(
    () => groupIncomesBySource(filteredIncomes),
    [filteredIncomes]
  );

  const totalIncomes = useMemo(
    () => calculateTotalIncomes(filteredIncomes),
    [filteredIncomes]
  );

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#6366f1", "#ec4899"];

  // Custom label renderer for pie chart
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
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
    <Card className="w-full bg-gray-800 border-gray-700 mt-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-white" />
            <span className="text-white">Income Overview</span>
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
              <span>Total: ${totalIncomes.toFixed(2)}</span>
              <span className="text-sm text-gray-500">
                ({filteredIncomes.length} records)
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
            <div className="w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categorizedIncomes}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="source"
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
                                  Source
                                </span>
                                <span className="font-bold text-white">
                                  {payload[0].payload.source}
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
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="pie">
            <div className="flex flex-col items-center">
              <div className="w-full h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categorizedIncomes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={150}
                      innerRadius={60}
                      fill="#8884d8"
                      dataKey="totalAmount"
                      nameKey="source"
                      label={renderCustomizedLabel}
                    >
                      {categorizedIncomes.map((entry, index) => (
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
                                    Source
                                  </span>
                                  <span className="font-bold text-white">
                                    {payload[0].payload.source}
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
                                <div className="flex flex-col col-span-2">
                                  <span className="text-[0.70rem] uppercase text-gray-400">
                                    Percentage
                                  </span>
                                  <span className="font-bold text-white">
                                    {(
                                      (payload[0].payload.totalAmount /
                                        totalIncomes) *
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
                {categorizedIncomes.map((item, index) => (
                  <div key={item.source} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm text-gray-300">{item.source}</span>
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

export default IncomeChartContainer;