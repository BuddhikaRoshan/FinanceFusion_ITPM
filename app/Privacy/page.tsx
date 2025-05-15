"use client";
import React, { useState, useRef } from "react";
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
  ChevronDown,
  Cookie,
  Users,
  Clock,
  Mail
} from "lucide-react";

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const sectionRefs = useRef({});

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = sectionRefs.current[sectionId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const sections = [
    {
      id: "overview",
      title: "Overview",
      icon: FileText,
      content: (
        <div className="space-y-4">
          <p className="text-white">This Privacy Policy describes how FinanceFusion collects, uses, and protects your personal information when you use our services.</p>
          <p className="text-white">We are committed to ensuring that your privacy is protected and that we comply with all applicable data protection laws.</p>
        </div>
      )
    },
    {
      id: "collection",
      title: "Information We Collect",
      icon: Users,
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white mb-2">Personal Information</h3>
          <ul className="list-disc list-inside space-y-2 text-white">
            <li>Name and contact information</li>
            <li>Financial account details</li>
            <li>Transaction history</li>
            <li>Device and usage information</li>
          </ul>
        </div>
      )
    },
    {
      id: "usage",
      title: "How We Use Your Information",
      icon: AlertCircle,
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white mb-2">Primary Uses</h3>
          <ul className="list-disc list-inside space-y-2 text-white">
            <li>Providing and improving our services</li>
            <li>Processing transactions</li>
            <li>Personalizing your experience</li>
            <li>Communicating with you</li>
          </ul>
        </div>
      )
    },
    {
      id: "sharing",
      title: "Information Sharing",
      icon: Users,
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white mb-2">Sharing Practices</h3>
          <ul className="list-disc list-inside space-y-2 text-white">
            <li>With your consent</li>
            <li>For legal requirements</li>
            <li>With service providers</li>
            <li>For business transfers</li>
          </ul>
        </div>
      )
    },
    {
      id: "security",
      title: "Data Security",
      icon: Shield,
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white mb-2">Security Measures</h3>
          <ul className="list-disc list-inside space-y-2 text-white">
            <li>Encryption of sensitive data</li>
            <li>Regular security audits</li>
            <li>Access controls</li>
            <li>Secure data storage</li>
          </ul>
        </div>
      )
    },
    {
      id: "retention",
      title: "Data Retention",
      icon: Clock,
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white mb-2">Retention Periods</h3>
          <ul className="list-disc list-inside space-y-2 text-white">
            <li>As long as your account is active</li>
            <li>To comply with legal obligations</li>
            <li>To resolve disputes</li>
            <li>To enforce agreements</li>
          </ul>
        </div>
      )
    },
    {
      id: "rights",
      title: "Your Rights",
      icon: User,
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white mb-2">User Rights</h3>
          <ul className="list-disc list-inside space-y-2 text-white">
            <li>Access your data</li>
            <li>Correct inaccurate data</li>
            <li>Request data deletion</li>
            <li>Object to processing</li>
          </ul>
        </div>
      )
    },
    {
      id: "cookies",
      title: "Cookies and Tracking",
      icon: Cookie,
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white mb-2">Cookie Policy</h3>
          <ul className="list-disc list-inside space-y-2 text-white">
            <li>Essential cookies</li>
            <li>Analytics cookies</li>
            <li>Marketing cookies</li>
            <li>Cookie preferences</li>
          </ul>
        </div>
      )
    },
    {
      id: "children",
      title: "Children's Privacy",
      icon: Users,
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white mb-2">Children's Data</h3>
          <ul className="list-disc list-inside space-y-2 text-white">
            <li>No collection from children under 13</li>
            <li>Parental consent requirements</li>
            <li>Age verification</li>
            <li>Data protection measures</li>
          </ul>
        </div>
      )
    },
    {
      id: "changes",
      title: "Policy Changes",
      icon: AlertCircle,
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white mb-2">Updates to Policy</h3>
          <ul className="list-disc list-inside space-y-2 text-white">
            <li>Notification of changes</li>
            <li>Review of updates</li>
            <li>Acceptance of changes</li>
            <li>Historical versions</li>
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
            Privacy Policy
          </h1>
          <p className="text-xl text-white max-w-3xl mx-auto">
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
                    onClick={() => scrollToSection(section.id)}
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
                  ref={(el) => (sectionRefs.current[section.id] = el)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mb-12 last:mb-0"
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
              <div className="flex items-center mb-4">
                <Mail className="h-8 w-8 text-blue-400 mr-4" />
                <h3 className="text-xl font-semibold text-white">Contact Us</h3>
              </div>
              <p className="text-white mb-4">
                If you have any questions about our Privacy Policy, please contact us at:
              </p>
              <div className="space-y-2 text-white">
                <p>Email: privacy@financefusion.com</p>
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

export default PrivacyPolicy;