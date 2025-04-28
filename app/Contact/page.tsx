"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    file: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you for contacting us! We'll get back to you soon.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
            Contact Us
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
            We would love to hear from you! Please reach out with any questions, feedback, or suggestions.
          </p>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg"
        >
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-lg font-semibold text-gray-300">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 mt-2 border border-gray-600 rounded-md bg-gray-700 text-gray-300"
                placeholder="Enter your name"
                required
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-lg font-semibold text-gray-300">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 mt-2 border border-gray-600 rounded-md bg-gray-700 text-gray-300"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label htmlFor="phone" className="block text-lg font-semibold text-gray-300">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 mt-2 border border-gray-600 rounded-md bg-gray-700 text-gray-300"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Subject */}
            <div className="mb-4">
              <label htmlFor="subject" className="block text-lg font-semibold text-gray-300">
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full p-3 mt-2 border border-gray-600 rounded-md bg-gray-700 text-gray-300"
                required
              >
                <option value="">Select a subject</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Support">Support</option>
                <option value="Feedback">Feedback</option>
              </select>
            </div>

            {/* Message */}
            <div className="mb-4">
              <label htmlFor="message" className="block text-lg font-semibold text-gray-300">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                className="w-full p-3 mt-2 border border-gray-600 rounded-md bg-gray-700 text-gray-300"
                placeholder="Enter your message"
                required
              />
            </div>

            {/* File Upload */}
            <div className="mb-6">
              <label htmlFor="file" className="block text-lg font-semibold text-gray-300">
                Attachment (Optional)
              </label>
              <input
                type="file"
                id="file"
                name="file"
                onChange={handleFileChange}
                className="w-full p-2 mt-2 text-gray-300"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-md hover:bg-gradient-to-l transition-all"
            >
              Submit
            </button>
          </form>
        </motion.div>

        {/* Company Contact Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-6xl mx-auto mt-16 text-center bg-gray-800 p-8 rounded-lg shadow-lg"
        >
          <h2 className="text-3xl font-semibold text-blue-400 mb-6">
            Our Contact Details
          </h2>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-300">Contact Email:</h3>
            <p className="text-gray-400">support@financefusion.com</p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-300">Phone Numbers:</h3>
            <p className="text-gray-400">+94 123-456-789</p>
            <p className="text-gray-400">+94 987-654-321</p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-300">Founder Message:</h3>
            <p className="text-gray-400 italic">
              "At FinanceFusion, we are committed to helping individuals achieve financial freedom through cutting-edge AI solutions. Our mission is to provide easy-to-use tools for smarter financial decision-making."
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-300">Our Team:</h3>
            <p className="text-gray-400 italic">
              "Our team at FinanceFusion works tirelessly to bring you the best in AI-powered financial tools. We're dedicated to supporting your financial journey and making it as seamless as possible."
            </p>
          </div>
        </motion.div>

      </div>
      <Footer />
    </div>
  );
};

export default ContactUs;
