"use client";
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6 text-center">
          Privacy Policy
        </h1>

        <div className="text-lg text-gray-300 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">Introduction</h2>
          <p>
            At FinanceFusion, your privacy is of utmost importance to us. This Privacy Policy document outlines the types of personal information that is received and collected by FinanceFusion and how it is used.
          </p>

          <h2 className="text-2xl font-semibold text-gray-100 mb-4 mt-8">Information Collection</h2>
          <p>
            We collect personal information when you use our services, such as your name, email address, phone number, and financial data (if applicable). This information is used to provide and improve our services.
          </p>

          <h2 className="text-2xl font-semibold text-gray-100 mb-4 mt-8">How We Use Your Information</h2>
          <p>
            We may use the information we collect in the following ways:
          </p>
          <ul className="list-disc pl-5 text-gray-400">
            <li>To personalize and enhance your user experience.</li>
            <li>To process transactions or requests.</li>
            <li>To send periodic emails for updates, promotions, or other marketing materials.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-100 mb-4 mt-8">Data Protection</h2>
          <p>
            We implement a variety of security measures to maintain the safety of your personal information. Your data is stored in secure databases and is encrypted during transmission.
          </p>

          <h2 className="text-2xl font-semibold text-gray-100 mb-4 mt-8">Cookies</h2>
          <p>
            We may use cookies to enhance the user experience on our website. Cookies are small files that are stored on your device to help us improve functionality and track user behavior.
          </p>

          <h2 className="text-2xl font-semibold text-gray-100 mb-4 mt-8">Your Rights</h2>
          <p>
            You have the right to access, modify, or delete your personal information. You can also request that we restrict or cease the processing of your data.
          </p>

          <h2 className="text-2xl font-semibold text-gray-100 mb-4 mt-8">Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. Any changes will be posted on this page, and the date of the last update will be noted at the bottom of this page.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;