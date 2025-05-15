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
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";

interface SpecialPayment {
  id: string;
  paidAmount: number;
  paidDate: Date;
  reason?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const SpecialPaymentPage = () => {
  const [payments, setPayments] = useState<SpecialPayment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<SpecialPayment[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPayment, setCurrentPayment] = useState<Partial<SpecialPayment>>(
    {
      paidAmount: 0,
      paidDate: new Date(),
      reason: "",
      userId: localStorage.getItem("userId")!,
    }
  );
  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch all special payments
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch("/api/special-payments");
        if (!response.ok) throw new Error("Failed to fetch payments");
        const data = await response.json();
        setPayments(
          data.filter(
            (payment: SpecialPayment) =>
              payment.userId === localStorage.getItem("userId")
          )
        );
        setFilteredPayments(data);
      } catch (error) {
        toast.error("Error loading payments");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // Filter payments based on search term
  useEffect(() => {
    const filtered = payments.filter((payment) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        payment.reason?.toLowerCase().includes(searchLower) ||
        payment.paidAmount.toString().includes(searchLower) ||
        format(new Date(payment.paidDate), "PPP")
          .toLowerCase()
          .includes(searchLower)
      );
    });
    setFilteredPayments(filtered);
  }, [searchTerm, payments]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentPayment((prev) => ({
      ...prev,
      [name]: name === "paidAmount" ? parseFloat(value) : value,
    }));
  };

  // Validate form
  const validateForm = () => {
    if (!currentPayment.paidAmount || currentPayment.paidAmount <= 0) {
      toast.error("Payment amount must be positive");
      return false;
    }
    if (!currentPayment.paidDate) {
      toast.error("Payment date is required");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const url = isEditMode
        ? `/api/special-payments/${currentPayment.id}`
        : "/api/special-payments";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paidAmount: currentPayment.paidAmount,
          reason: currentPayment.reason,
          paidDate: currentPayment.paidDate?.toISOString(),
          userId: localStorage.getItem("userId"),
        }),
      });

      if (!response.ok) throw new Error("Operation failed");

      const data = await response.json();
      toast.success(
        isEditMode
          ? "Payment updated successfully"
          : "Payment created successfully"
      );

      // Update local state
      if (isEditMode) {
        setPayments((prev) =>
          prev.map((p) => (p.id === currentPayment.id ? data : p))
        );
      } else {
        setPayments((prev) => [...prev, data]);
      }

      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Error processing payment");
      console.error(error);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/special-payments/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Delete failed");

      toast.success("Payment deleted successfully");
      setPayments((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      toast.error("Error deleting payment");
      console.error(error);
    }
  };

  // Reset form
  const resetForm = () => {
    setCurrentPayment({
      paidAmount: 0,
      paidDate: new Date(),
      reason: "",
    });
    setIsEditMode(false);
  };

  // Generate PDF report
  const generatePDF = () => {
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

    // ===== DOCUMENT TITLE =====
    const title = "Special Payments Report";
    doc.setTextColor(darkGray);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(title, 14, 45);

    // Metadata
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 55);

    // Decorative line
    doc.setDrawColor(primaryBlue);
    doc.setLineWidth(0.5);
    doc.line(14, 60, pageWidth - 14, 60);

    // ===== TABLE =====
    const headers = [["Amount", "Date", "Reason"]];
    const data = filteredPayments.map((payment) => [
      `LKR ${payment.paidAmount.toFixed(2)}`,
      format(new Date(payment.paidDate), "PPP"),
      payment.reason || "-",
    ]);

    autoTable(doc, {
      startY: 70,
      head: headers,
      body: data,
      theme: "grid",
      headStyles: {
        fillColor: primaryBlue,
        textColor: white,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: lightGray,
      },
      styles: {
        overflow: "linebreak",
        cellPadding: 5,
      },
      margin: { top: 70, right: 14, bottom: 30, left: 14 },
      didDrawPage: (data) => {
        // Add header to continuation pages if needed
        if (data.pageNumber > 1) {
          doc.setFillColor(primaryBlue);
          doc.rect(0, 0, pageWidth, 20, "F");
          doc.setTextColor(white);
          doc.setFontSize(14);
          doc.text("FinanceFusion - Special Payments Report", 14, 12);
        }

        // ===== FOOTER =====
        doc.setDrawColor(primaryBlue);
        doc.setLineWidth(0.5);
        doc.line(14, pageHeight - 20, pageWidth - 14, pageHeight - 20);

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
          "This document contains confidential financial information.",
          pageWidth / 2,
          pageHeight - 10,
          { align: "center" }
        );
      },
    });

    // Save the PDF with branded filename
    doc.save("special-payments-report.pdf");
  };

  // Open edit dialog
  const openEditDialog = (payment: SpecialPayment) => {
    setCurrentPayment({
      ...payment,
      paidDate: new Date(payment.paidDate),
    });
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-800">
      <Navbar />
      <Toaster richColors position="top-right" />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Stats Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Total Payments</p>
                <h3 className="text-2xl font-bold text-white mt-1">
                  LKR {payments.reduce((sum, p) => sum + p.paidAmount, 0).toFixed(2)}
                </h3>
              </div>
              <div className="p-3 bg-blue-900/30 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-emerald-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">This Month</p>
                <h3 className="text-2xl font-bold text-white mt-1">
                  LKR {payments
                    .filter(p => new Date(p.paidDate).getMonth() === new Date().getMonth())
                    .reduce((sum, p) => sum + p.paidAmount, 0)
                    .toFixed(2)}
                </h3>
              </div>
              <div className="p-3 bg-emerald-900/30 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-violet-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Payment Streak</p>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {payments.length} Payments
                </h3>
              </div>
              <div className="p-3 bg-violet-900/30 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-indigo-200">Special Payments</h1>
              <p className="text-gray-400 mt-1">Track and manage your special financial transactions</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={generatePDF}
                variant="outline"
                className="bg-gray-700 border-gray-600 hover:bg-gray-600 text-gray-300 hover:text-gray-200 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Report
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-indigo-100 transition-colors duration-200 shadow-md hover:shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Payment
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-800 border-gray-700">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-indigo-200">
                      {isEditMode ? "Edit Payment" : "Create New Payment"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="paidAmount" className="text-sm font-medium text-gray-400">
                        Payment Amount
                      </Label>
                      <Input
                        id="paidAmount"
                        name="paidAmount"
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={currentPayment.paidAmount || ""}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700/50 border-gray-600 text-indigo-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                        placeholder="Enter payment amount"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paidDate" className="text-sm font-medium text-gray-400">
                        Payment Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal bg-gray-700/50 border-gray-600 text-indigo-100 hover:bg-gray-700 transition-colors duration-200",
                              !currentPayment.paidDate && "text-gray-500"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {currentPayment.paidDate ? (
                              format(currentPayment.paidDate, "PPP")
                            ) : (
                              <span>Select payment date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                          <Calendar
                            mode="single"
                            selected={currentPayment.paidDate}
                            onSelect={(date) =>
                              setCurrentPayment((prev) => ({
                                ...prev,
                                paidDate: date || new Date(),
                              }))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reason" className="text-sm font-medium text-gray-400">
                        Payment Description
                      </Label>
                      <Input
                        id="reason"
                        name="reason"
                        value={currentPayment.reason || ""}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700/50 border-gray-600 text-indigo-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                        placeholder="Describe the purpose of this payment"
                      />
                    </div>
                  </div>
                  <DialogFooter className="gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false);
                        resetForm();
                      }}
                      className="bg-gray-700 border-gray-600 hover:bg-gray-600 text-gray-300 hover:text-gray-200 transition-colors duration-200"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="button" 
                      onClick={handleSubmit}
                      className="bg-indigo-600 hover:bg-indigo-700 text-indigo-100 transition-colors duration-200 shadow-md hover:shadow-lg"
                    >
                      {isEditMode ? "Update Payment" : "Create Payment"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Input
                placeholder="Search payments by amount, date, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-md bg-gray-700/50 border-gray-600 text-indigo-100 pl-10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-12 bg-gray-700/50 rounded-lg">
              <svg
                className="mx-auto h-12 w-12 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-indigo-200">No payments yet</h3>
              <p className="mt-1 text-sm text-gray-400">
                {searchTerm
                  ? "No matching payments found"
                  : "Create your first special payment to get started"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700/70 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-900/30 rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium text-indigo-200">
                            LKR {payment.paidAmount.toFixed(2)}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {payment.reason || "No description"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-400">
                          Payment Date
                        </p>
                        <p className="text-sm font-medium text-indigo-200">
                          {format(new Date(payment.paidDate), "MMM d, yyyy")}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-gray-700/50 border-gray-600 hover:bg-gray-600 text-gray-300 hover:text-gray-200 transition-colors duration-200 flex items-center gap-1.5"
                          onClick={() => openEditDialog(payment)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 transition-colors duration-200 flex items-center gap-1.5"
                          onClick={() => handleDelete(payment.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpecialPaymentPage;
