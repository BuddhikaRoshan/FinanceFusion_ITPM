"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { deleteUser, updateUser, getUserById } from "@/services/user.service";
import { Loader2, Printer, Save, Trash2, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import Navbar from "@/components/Navbar";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import ProfileImage from "@/components/ProfileImage";
import PointsContainer from "@/components/PointsContainer";

// Enhanced validation schema with regex patterns
const profileSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .regex(/^[a-zA-Z\s.]+$/, "Name can only contain letters, spaces, and dots"),

  email: z
    .string()
    .email("Invalid email address")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format"
    ),

  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "Password must contain at least one uppercase, one lowercase, one number, and one special character"
    )
    .optional(),

  contactNumber: z
    .string()
    .min(10, "Contact number must be at least 10 digits")
    .max(15, "Contact number cannot exceed 15 digits")
    .regex(/^[0-9]+$/, "Contact number can only contain numbers")
    .optional(),

  position: z.enum([
    "Government Employee",
    "Private Employee",
    "Self Employee",
    "Other",
  ]),

  incomeSources: z
    .array(z.string())
    .nonempty("At least one income source is required"),

  financialGoals: z
    .array(z.string())
    .nonempty("At least one financial goal is required"),
});

const ProfilePage = () => {
  const router = useRouter();
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    setUserId(localStorage.getItem("userId")!);
  }, []);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
      contactNumber: "",
      position: "Government Employee",
      incomeSources: [],
      financialGoals: [],
    },
  });

  const generatePDF = () => {
    const userData = form.getValues();
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
    doc.text("User Profile", 14, 45);

    // Metadata
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 55);

    // Decorative line
    doc.setDrawColor(primaryBlue);
    doc.setLineWidth(0.5);
    doc.line(14, 60, pageWidth - 14, 60);

    // ===== TABLE =====
    const tableData = [
      ["Name", userData.name],
      ["Email", userData.email],
      ["Username", userData.username],
      ["Contact Number", userData.contactNumber || "Not Provided"],
      ["Position", userData.position],
      ["Income Sources", userData.incomeSources.join(", ")],
      ["Financial Goals", userData.financialGoals.join(", ")],
    ];

    autoTable(doc, {
      startY: 70,
      head: [["Field", "Value"]],
      body: tableData,
      headStyles: {
        fillColor: primaryBlue,
        textColor: white,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: lightGray,
      },
      columnStyles: {
        0: {
          cellWidth: 50,
          fontStyle: "bold",
          halign: "left",
        },
        1: {
          halign: "left",
          cellWidth: "auto",
        },
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
          doc.text("FinanceFusion - User Profile", 14, 12);
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
          "This document contains confidential user information.",
          pageWidth / 2,
          pageHeight - 10,
          { align: "center" }
        );
      },
    });

    // Save the PDF with branded filename
    doc.save("financefusion-user-profile.pdf");
  };

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoadingProfile(true);

      try {
        const user = await getUserById(localStorage.getItem("userId")!);
        form.reset({
          name: user.name,
          email: user.email,
          username: user.username,
          contactNumber: user.contactNumber || "",
          position: user.position,
          incomeSources: user.incomeSources || [],
          financialGoals: user.financialGoals || [],
        });
      } catch (error) {
        alert(
          error instanceof Error ? error.message : "Failed to fetch user data"
        );
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchUser();
  }, [router, form]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    router.push("/login");
  };

  const handleUpdate = async (data: z.infer<typeof profileSchema>) => {
    setIsUpdating(true);
    try {
      await updateUser(localStorage.getItem("userId")!, data);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      // alert(
      //   error instanceof Error ? error.message : "Failed to update profile"
      // );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      await deleteUser(localStorage.getItem("userId")!);
      localStorage.removeItem("userId");
      alert("Account deleted successfully!");
      router.push("/register");
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to delete account"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center"
        >
          <div className="w-full max-w-6xl p-8 space-y-10 bg-gray-800/95 rounded-3xl shadow-2xl backdrop-blur-sm border border-gray-700/50">
            {/* Profile Header Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-center space-y-8"
            >
              <div className="flex flex-col items-center space-y-6">
                <div className="relative group">
                  <div className="absolute -inset-1    "></div>
                  <div className="relative flex flex-col items-center gap-6">
                    <ProfileImage userId={userId} />
                    <div className="transform">
                      <PointsContainer userId={userId} />
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h1 className="text-5xl font-bold">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                      Your Profile
                    </span>
                  </h1>
                  <p className="text-gray-300 text-xl">Manage your account details</p>
                </div>
              </div>
            </motion.div>

            {/* Export PDF Button */}
            <div className="flex justify-end">
              <Button
                onClick={generatePDF}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                <Printer className="mr-2 h-5 w-5" />
                Export to PDF
              </Button>
            </div>

            {isLoadingProfile ? (
              <div className="flex justify-center items-center py-20">
                <div className="flex flex-col items-center space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                  <span className="text-gray-300 text-xl">
                    Loading your profile...
                  </span>
                </div>
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleUpdate)}
                  className="space-y-10"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* First column */}
                    <div className="space-y-8">
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="bg-gray-700/50 p-8 rounded-2xl border border-gray-600/50 hover:border-gray-500/50 transition-colors duration-300"
                      >
                        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                          <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                            Personal Information
                          </span>
                        </h2>
                        <div className="space-y-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-300 text-lg">Name</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="John Doe"
                                    {...field}
                                    className="bg-gray-700/80 border-gray-600 text-white focus:ring-2 focus:ring-blue-500 h-12 text-lg"
                                  />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-300 text-lg">Email</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="john@example.com"
                                    {...field}
                                    className="bg-gray-700/80 border-gray-600 text-white focus:ring-2 focus:ring-blue-500 h-12 text-lg"
                                  />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-300 text-lg">Username</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="john_doe123"
                                    {...field}
                                    className="bg-gray-700/80 border-gray-600 text-white focus:ring-2 focus:ring-blue-500 h-12 text-lg"
                                  />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-300 text-lg">New Password</FormLabel>
                                <FormControl>
                                  <Input
                                    type="password"
                                    placeholder="Leave empty to keep current"
                                    {...field}
                                    className="bg-gray-700/80 border-gray-600 text-white focus:ring-2 focus:ring-blue-500 h-12 text-lg"
                                  />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </motion.div>
                    </div>

                    {/* Second column */}
                    <div className="space-y-8">
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="bg-gray-700/50 p-8 rounded-2xl border border-gray-600/50 hover:border-gray-500/50 transition-colors duration-300"
                      >
                        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                          <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                            Professional Details
                          </span>
                        </h2>
                        <div className="space-y-6">
                          <FormField
                            control={form.control}
                            name="contactNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-300 text-lg">Contact Number</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="1234567890"
                                    {...field}
                                    className="bg-gray-700/80 border-gray-600 text-white focus:ring-2 focus:ring-blue-500 h-12 text-lg"
                                  />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="position"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-300 text-lg">Position</FormLabel>
                                <FormControl>
                                  <select
                                    {...field}
                                    className="w-full p-3 bg-gray-700/80 border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 h-12 text-lg"
                                  >
                                    <option value="Government Employee">Government Employee</option>
                                    <option value="Private Employee">Private Employee</option>
                                    <option value="Self Employee">Self Employee</option>
                                    <option value="Other">Other</option>
                                  </select>
                                </FormControl>
                                <FormMessage className="text-red-400" />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="incomeSources"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-300 text-lg">Income Sources</FormLabel>
                                <FormControl>
                                  <TagInput
                                    tags={field.value}
                                    onAdd={(tag) => field.onChange([...field.value, tag])}
                                    onRemove={(tag) => field.onChange(field.value.filter((t) => t !== tag))}
                                  />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="financialGoals"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-300 text-lg">Financial Goals</FormLabel>
                                <FormControl>
                                  <TagInput
                                    tags={field.value}
                                    onAdd={(tag) => field.onChange([...field.value, tag])}
                                    onRemove={(tag) => field.onChange(field.value.filter((t) => t !== tag))}
                                  />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-6 pt-8">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                      className="flex-1"
                    >
                      <Button
                        type="submit"
                        disabled={isUpdating || isDeleting}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-7 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 text-lg border-0"
                      >
                        {isUpdating ? (
                          <div className="flex items-center justify-center">
                            <Loader2 className="animate-spin h-6 w-6 mr-2" />
                            Updating...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <Save className="h-5 w-5 mr-2" />
                            Update Profile
                          </div>
                        )}
                      </Button>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9, duration: 0.5 }}
                      className="flex-1"
                    >
                      <Button
                        onClick={handleDelete}
                        disabled={isUpdating || isDeleting}
                        className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium py-7 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 text-lg border-0"
                      >
                        {isDeleting ? (
                          <div className="flex items-center justify-center">
                            <Loader2 className="animate-spin h-6 w-6 mr-2" />
                            Deleting...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <Trash2 className="h-5 w-5 mr-2" />
                            Delete Account
                          </div>
                        )}
                      </Button>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.0, duration: 0.5 }}
                      className="flex-1"
                    >
                      <Button
                        onClick={handleLogout}
                        disabled={isUpdating || isDeleting}
                        className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white font-medium py-7 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 text-lg border-0"
                      >
                        <div className="flex items-center justify-center">
                          <LogOut className="h-5 w-5 mr-2" />
                          Logout
                        </div>
                      </Button>
                    </motion.div>
                  </div>
                </form>
              </Form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Update TagInput component styling
const TagInput = ({
  tags,
  onAdd,
  onRemove,
}: {
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Type and press Enter to add"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleAddTag}
        className="bg-gray-700/80 border-gray-600 text-white focus:ring-2 focus:ring-blue-500 h-12 text-lg"
      />
      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="bg-gray-600/80 text-gray-200 px-4 py-2 rounded-full hover:bg-gray-500/80 transition-colors text-base"
          >
            {tag}
            <button
              type="button"
              onClick={() => onRemove(tag)}
              className="ml-2 p-1 hover:bg-gray-500/80 rounded-full transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
