import { Expense } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import {
  createExpense,
  updateExpense,
  deleteExpense,
} from "@/services/expense.service";
import { useState } from "react";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import { expenseSchema } from "@/schemas/expense.schema";
import { z } from "zod";
import { ExpenseForm } from "./ExpenseForm";
import { ExpenseCard } from "./ExpenseCard";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { motion, AnimatePresence } from "framer-motion";

interface ExpenseListProps {
  initialExpenses: Expense[];
  userId: string;
}

export const ExpenseList = ({ initialExpenses, userId }: ExpenseListProps) => {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [filter, setFilter] = useState<string>("");
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const filteredExpenses = expenses.filter((expense) =>
    expense.category.toLowerCase().includes(filter.toLowerCase())
  );

  const refreshExpenses = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/expenses?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setExpenses(data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error refreshing expenses");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrUpdateExpense = async (
    data: z.infer<typeof expenseSchema>
  ) => {
    try {
      setIsLoading(true);
      if (editingExpense) {
        await updateExpense(editingExpense.id, data);
        toast.success("Expense updated successfully");
      } else {
        await createExpense({ ...data, userId });
        toast.success("Expense created successfully");
      }
      setIsDialogOpen(false);
      setEditingExpense(null);

      await refreshExpenses();
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error("Error saving expense");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;
    try {
      setIsLoading(true);
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
      toast.success("Expense deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete expense");
    } finally {
      setIsLoading(false);
    }
  };
  const COLORS = {
    primaryBlue: "#0d3b66", // Dark blue
    lightBlue: "#4a90e2",
    white: "#ffffff",
    lightGray: "#f5f5f5",
    darkGray: "#333333",
  };

  const generatePDF = (): void => {
    const filteredExpenses: Expense[] = expenses;
    const userName: string = "User";
    const reportTitle: string = "Expense Report";

    // Create new document (portrait, mm, A4)
    const doc = new jsPDF();

    // Get page dimensions
    const pageWidth = doc.internal.pageSize.getWidth();

    // ===== HEADER =====
    // Header background
    doc.setFillColor(COLORS.primaryBlue);
    doc.rect(0, 0, pageWidth, 30, "F");

    // Company logo (if you have one, otherwise we'll use text)
    doc.setTextColor(COLORS.white);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("FinanceFusion", 14, 15);

    // AI Enhanced badge
    doc.setFillColor(COLORS.lightBlue);
    doc.roundedRect(pageWidth - 70, 8, 60, 14, 3, 3, "F");
    doc.setFontSize(10);
    doc.setTextColor(COLORS.white);
    doc.text("AI ENHANCED", pageWidth - 40, 16, { align: "center" });

    // ===== DOCUMENT TITLE & META =====
    doc.setTextColor(COLORS.darkGray);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(reportTitle, 14, 45);

    // Metadata section
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(COLORS.darkGray);

    const today = new Date().toLocaleDateString();
    doc.text(`Generated for: ${userName}`, 14, 55);
    doc.text(`Date: ${today}`, 14, 62);
    doc.text(
      `Total Expenses: LKR ${calculateTotal(filteredExpenses).toFixed(2)}`,
      14,
      69
    );

    // Decorative line
    doc.setDrawColor(COLORS.primaryBlue);
    doc.setLineWidth(0.5);
    doc.line(14, 75, pageWidth - 14, 75);

    // ===== TABLE =====
    autoTable(doc, {
      startY: 85,
      head: [["Amount (LKR)", "Category", "Date", "Description"]],
      body: filteredExpenses.map((expense) => [
        expense.amount.toFixed(2),
        expense.category,
        new Date(expense.date).toLocaleDateString(),
        expense.reason || "",
      ]),
      headStyles: {
        fillColor: COLORS.primaryBlue,
        textColor: COLORS.white,
        fontStyle: "bold",
        halign: "center",
      },
      alternateRowStyles: {
        fillColor: COLORS.lightGray,
      },
      columnStyles: {
        0: { halign: "right", cellWidth: 30 },
        1: { halign: "left", cellWidth: 40 },
        2: { halign: "center", cellWidth: 30 },
        3: { halign: "left" },
      },
      margin: { top: 85, right: 14, bottom: 25, left: 14 },
      didDrawPage: (data) => {
        // Add header to each new page
        if (data.pageNumber > 1) {
          // Simplified header for continuation pages
          doc.setFillColor(COLORS.primaryBlue);
          doc.rect(0, 0, pageWidth, 20, "F");
          doc.setTextColor(COLORS.white);
          doc.setFontSize(14);
          doc.text("FinanceFusion - Expense Report", 14, 12);
        }

        // Add footer to each page
        addFooter(doc, data.pageNumber);
      },
    });

    // Make sure footer is added to the first page
    addFooter(doc, 1);

    // Save the PDF
    doc.save("financefusion-expenses.pdf");
  };

  const addFooter = (doc: jsPDF, pageNumber: number): void => {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Footer line
    doc.setDrawColor(COLORS.primaryBlue);
    doc.setLineWidth(0.5);
    doc.line(14, pageHeight - 20, pageWidth - 14, pageHeight - 20);

    // Footer text
    doc.setTextColor(COLORS.primaryBlue);
    doc.setFontSize(10);
    doc.text(
      "FinanceFusion - AI Enhanced Financial Solutions",
      14,
      pageHeight - 15
    );
    doc.text(`Page ${pageNumber}`, pageWidth - 14, pageHeight - 15, {
      align: "right",
    });
    doc.setFontSize(8);
    doc.text(
      "This report was generated automatically. For support contact support@financefusion.com",
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
  };

  const calculateTotal = (expenses: Expense[]): number => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <Input
          type="text"
          placeholder="Filter by category"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full md:w-1/3 bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <Button
            onClick={generatePDF}
            variant="outline"
            disabled={isLoading || filteredExpenses.length === 0}
            className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            Generate PDF
          </Button>
          <Button
            onClick={refreshExpenses}
            variant="outline"
            disabled={isLoading}
            className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            Refresh
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700 text-white">
              <ExpenseForm
                onSubmit={handleCreateOrUpdateExpense}
                defaultValues={editingExpense || undefined}
                userId={userId}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-center my-4 text-gray-400"
        >
          Loading expenses...
        </motion.div>
      )}
      {!isLoading && filteredExpenses.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-center my-4 p-8 border border-dashed border-gray-700 rounded-lg text-gray-400"
        >
          {filter
            ? "No expenses match your filter"
            : "No expenses yet. Add your first expense!"}
        </motion.div>
      )}

      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"
      >
        <AnimatePresence>
          {filteredExpenses.map((expense) => (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              layout
            >
              <ExpenseCard
                expense={expense}
                onEdit={() => {
                  setEditingExpense(expense);
                  setIsDialogOpen(true);
                }}
                onDelete={handleDeleteExpense}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
