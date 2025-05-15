import { Income } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import {
  createIncome,
  updateIncome,
  deleteIncome,
} from "@/services/income.service";
import { useState } from "react";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import { incomeSchema } from "@/schemas/income.schema";
import { z } from "zod";
import { IncomeForm } from "./IncomeForm";
import { IncomeCard } from "./IncomeCard";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { motion, AnimatePresence } from "framer-motion";

interface IncomeListProps {
  initialIncomes: Income[];
  userId: string;
}

export const IncomeList = ({ initialIncomes, userId }: IncomeListProps) => {
  const [incomes, setIncomes] = useState<Income[]>(initialIncomes);
  const [filter, setFilter] = useState<string>("");
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const filteredIncomes = incomes.filter((income) =>
    income.source.toLowerCase().includes(filter.toLowerCase())
  );

  const refreshIncomes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/incomes?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setIncomes(data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error refreshing incomes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrUpdateIncome = async (
    data: z.infer<typeof incomeSchema>
  ) => {
    try {
      setIsLoading(true);
      if (editingIncome) {
        await updateIncome(editingIncome.id, data);
        toast.success("Income updated successfully");
      } else {
        await createIncome({ ...data, userId });
        toast.success("Income created successfully");
      }
      setIsDialogOpen(false);
      setEditingIncome(null);
      await refreshIncomes();
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error("Error saving income");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteIncome = async (id: string) => {
    if (!confirm("Are you sure you want to delete this income?")) return;
    try {
      setIsLoading(true);
      await deleteIncome(id);
      setIncomes((prev) => prev.filter((income) => income.id !== id));
      toast.success("Income deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete income");
    } finally {
      setIsLoading(false);
    }
  };

  const generatePDF = () => {
    // Create new document
    const doc = new jsPDF();

    // Define colors
    const primaryBlue = "#0d3b66";
    const lightBlue = "#4a90e2";
    const white = "#ffffff";
    const darkGray = "#333333";
    const lightGray = "#f5f5f5";

    // Get page dimensions
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // ===== HEADER =====
    // Header background
    doc.setFillColor(primaryBlue);
    doc.rect(0, 0, pageWidth, 30, "F");

    // Company logo as text
    doc.setTextColor(white);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("FinanceFusion", 14, 15);

    // AI Enhanced badge
    doc.setFillColor(lightBlue);
    doc.roundedRect(pageWidth - 70, 8, 60, 14, 3, 3, "F");
    doc.setFontSize(10);
    doc.setTextColor(white);
    doc.text("AI ENHANCED", pageWidth - 40, 16, { align: "center" });

    // ===== DOCUMENT TITLE & META =====
    doc.setTextColor(darkGray);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Income Report", 14, 45);

    // Metadata
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(darkGray);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 55);

    // Calculate total income
    const totalIncome = filteredIncomes.reduce(
      (total, income) => total + income.amount,
      0
    );
    doc.text(`Total Income: LKR ${totalIncome.toFixed(2)}`, 14, 62);

    // Decorative line
    doc.setDrawColor(primaryBlue);
    doc.setLineWidth(0.5);
    doc.line(14, 70, pageWidth - 14, 70);

    // ===== TABLE =====
    autoTable(doc, {
      startY: 80,
      head: [["Amount (LKR)", "Source", "Date"]],
      body: filteredIncomes.map((income) => [
        income.amount.toFixed(2),
        income.source,
        new Date(income.date).toLocaleDateString(),
      ]),
      headStyles: {
        fillColor: primaryBlue,
        textColor: white,
        fontStyle: "bold",
        halign: "center",
      },
      alternateRowStyles: {
        fillColor: lightGray,
      },
      columnStyles: {
        0: { halign: "right", cellWidth: 40 },
        1: { halign: "left" },
        2: { halign: "center", cellWidth: 40 },
      },
      margin: { top: 80, right: 14, bottom: 30, left: 14 },
      didDrawPage: (data) => {
        // Add header to continuation pages
        if (data.pageNumber > 1) {
          doc.setFillColor(primaryBlue);
          doc.rect(0, 0, pageWidth, 20, "F");
          doc.setTextColor(white);
          doc.setFontSize(14);
          doc.text("FinanceFusion - Income Report", 14, 12);
        }

        // Add footer to each page
        // Footer line
        doc.setDrawColor(primaryBlue);
        doc.setLineWidth(0.5);
        doc.line(14, pageHeight - 20, pageWidth - 14, pageHeight - 20);

        // Footer text
        doc.setTextColor(primaryBlue);
        doc.setFontSize(10);
        doc.text(
          "FinanceFusion - AI Enhanced Financial Solutions",
          14,
          pageHeight - 15
        );
        doc.text(`Page ${data.pageNumber}`, pageWidth - 14, pageHeight - 15, {
          align: "right",
        });
        doc.setFontSize(8);
        doc.text(
          "This report was generated automatically. For support contact support@financefusion.com",
          pageWidth / 2,
          pageHeight - 10,
          { align: "center" }
        );
      },
    });

    // Save the PDF with a better filename
    doc.save("financefusion-income.pdf");
  };

  return (
    <div className="text-gray-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <Input
          type="text"
          placeholder="Filter by source"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full md:w-64 p-2 bg-gray-700 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <Button
            onClick={generatePDF}
            variant="outline"
            disabled={isLoading || filteredIncomes.length === 0}
            className="bg-transparent text-white border-gray-600 hover:bg-gray-700 hover:text-white"
          >
            Generate PDF
          </Button>
          <Button
            onClick={refreshIncomes}
            variant="outline"
            disabled={isLoading}
            className="bg-transparent text-white border-gray-600 hover:bg-gray-700 hover:text-white"
          >
            Refresh
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                Add Income
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700 text-white">
              <IncomeForm
                onSubmit={handleCreateOrUpdateIncome}
                defaultValues={editingIncome || undefined}
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
          className="text-center my-8 text-gray-400"
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          Loading incomes...
        </motion.div>
      )}
      {!isLoading && filteredIncomes.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-center my-8 p-8 border border-dashed border-gray-700 rounded-lg bg-gray-800/50"
        >
          {filter
            ? "No incomes match your filter"
            : "No incomes yet. Add your first income!"}
        </motion.div>
      )}

      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"
      >
        <AnimatePresence>
          {filteredIncomes.map((income) => (
            <motion.div
              key={income.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              layout
              transition={{ duration: 0.2 }}
            >
              <IncomeCard
                income={income}
                onEdit={() => {
                  setEditingIncome(income);
                  setIsDialogOpen(true);
                }}
                onDelete={handleDeleteIncome}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
