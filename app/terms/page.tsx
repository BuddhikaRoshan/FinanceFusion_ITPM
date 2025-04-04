"use client";
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6 text-center">
          Terms of Service
        </h1>

        <div className="text-lg text-gray-300 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">Introduction</h2>
          <p>
            These Terms of Service govern the use of FinanceFusion's services and products. By using our website and services, you agree to these terms and conditions.
          </p>

          <h2 className="text-2xl font-semibold text-gray-100 mb-4 mt-8">Use of Our Services</h2>
          <p>
            By using our website, you agree not to misuse or interfere with the proper operation of the service. You will not use the services for any unlawful or harmful purposes.
          </p>

          <h2 className="text-2xl font-semibold text-gray-100 mb-4 mt-8">Account Responsibilities</h2>
          <p>
            If you create an account with us, you are responsible for maintaining the confidentiality of your account details and for all activities under your account.
          </p>

          <h2 className="text-2xl font-semibold text-gray-100 mb-4 mt-8">User Content</h2>
          <p>
            You retain ownership of the content you submit through our services, but by submitting content, you grant us a license to use, store, and process it for the purposes of providing our services.
          </p>

          <h2 className="text-2xl font-semibold text-gray-100 mb-4 mt-8">Limitation of Liability</h2>
          <p>
            FinanceFusion will not be liable for any damages, losses, or expenses arising from the use of our services, including but not limited to indirect or consequential damages.
          </p>

          <h2 className="text-2xl font-semibold text-gray-100 mb-4 mt-8">Termination</h2>
          <p>
            We reserve the right to suspend or terminate your access to our services at our discretion, for any reason, including violation of these Terms of Service.
          </p>

          <h2 className="text-2xl font-semibold text-gray-100 mb-4 mt-8">Governing Law</h2>
          <p>
            These Terms of Service are governed by the laws of Sri Lanka. Any disputes arising out of or related to these terms shall be resolved in the appropriate courts in Sri Lanka.
          </p>

          <h2 className="text-2xl font-semibold text-gray-100 mb-4 mt-8">Changes to These Terms</h2>
          <p>
            We may update these Terms of Service from time to time. Any changes will be posted on this page with an updated date. You are advised to review this page periodically.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsOfService;