"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  FileText, 
  Shield, 
  User, 
  Lock, 
  AlertCircle, 
  HelpCircle,
  ChevronRight,
  ChevronDown
} from "lucide-react";

const TermsOfService = () => {
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    {
      id: "overview",
      title: "Overview",
      icon: FileText,
      content: (
        <div className="space-y-4">
          <p className="text-white">Welcome to FinanceFusion. By accessing or using our services, you agree to be bound by these Terms of Service.</p>
          <p className="text-white">These terms govern your use of our financial management platform, including all features, content, and services available through our website and mobile applications.</p>
        </div>
      )
    },
    {
      id: "account",
      title: "Account Terms",
      icon: User,
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white mb-2">Account Registration</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>You must be at least 18 years old to use our services</li>
            <li>You must provide accurate and complete information during registration</li>
            <li>You are responsible for maintaining the security of your account</li>
            <li>You must notify us immediately of any unauthorized access to your account</li>
          </ul>
        </div>
      )
    },
    {
      id: "privacy",
      title: "Privacy & Data",
      icon: Lock,
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white mb-2">Data Collection and Usage</h3>
          <p className="text-gray-300">We collect and process your personal and financial data in accordance with our Privacy Policy. This includes:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>Personal identification information</li>
            <li>Financial transaction data</li>
            <li>Usage statistics and preferences</li>
            <li>Device and browser information</li>
          </ul>
        </div>
      )
    },
    {
      id: "security",
      title: "Security",
      icon: Shield,
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white mb-2">Security Measures</h3>
          <p className="text-gray-300">We implement various security measures to protect your information:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>End-to-end encryption for sensitive data</li>
            <li>Regular security audits and updates</li>
            <li>Secure data storage and transmission</li>
            <li>Multi-factor authentication options</li>
          </ul>
        </div>
      )
    },
    {
      id: "usage",
      title: "Acceptable Use",
      icon: AlertCircle,
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white mb-2">Prohibited Activities</h3>
          <p className="text-gray-300">You agree not to:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>Use our services for any illegal purposes</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Interfere with the proper functioning of our services</li>
            <li>Share your account credentials with others</li>
          </ul>
        </div>
      )
    },
    {
      id: "liability",
      title: "Limitation of Liability",
      icon: HelpCircle,
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white mb-2">Our Liability</h3>
          <p className="text-gray-300">FinanceFusion shall not be liable for:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>Indirect, incidental, or consequential damages</li>
            <li>Loss of profits or data</li>
            <li>Service interruptions or technical issues</li>
            <li>Third-party actions or content</li>
          </ul>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navigation Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:w-64 flex-shrink-0"
          >
            <div className="bg-gray-800 rounded-xl shadow-xl p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-white mb-4">Quick Navigation</h2>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? "bg-blue-500 text-white"
                        : "text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    <section.icon className="h-5 w-5" />
                    <span>{section.title}</span>
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex-1"
          >
            <div className="bg-gray-800 rounded-xl shadow-xl p-8">
              {sections.map((section) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: activeSection === section.id ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className={`${activeSection === section.id ? "block" : "hidden"}`}
                >
                  <div className="flex items-center mb-6">
                    <section.icon className="h-8 w-8 text-blue-400 mr-4" />
                    <h2 className="text-2xl font-semibold text-white">{section.title}</h2>
                  </div>
                  {section.content}
                </motion.div>
              ))}
            </div>

            {/* Contact Information */}
            <div className="mt-8 bg-gray-800 rounded-xl shadow-xl p-8">
              <h3 className="text-xl font-semibold text-white mb-4">Contact Us</h3>
              <p className="text-gray-300">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="mt-4 space-y-2 text-gray-300">
                <p>Email: support@financefusion.com</p>
                <p>Phone: +1 (555) 123-4567</p>
                <p>Address: 123 Financial Street, Suite 100, New York, NY 10001</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsOfService;