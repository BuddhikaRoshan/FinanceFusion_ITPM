"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Form validation schema
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const ContactUs = () => {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof contactSchema>) => {
    try {
      // Handle form submission (you can integrate with an API here)
      console.log("Form submitted:", data);
      alert("Thank you for contacting us! We'll get back to you soon.");
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const faqs = [
    {
      question: "How can I get started with FinanceFusion?",
      answer: "Getting started is easy! Simply create an account, complete your profile, and you'll have access to all our AI-powered financial tools and features.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers. All transactions are secure and encrypted.",
    },
    {
      question: "How secure is my financial data?",
      answer: "We use bank-level encryption and security measures to protect your data. Your information is never shared with third parties without your consent.",
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time. There are no long-term commitments required.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
            Get in Touch
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Have questions? We're here to help. Our team is ready to assist you with any inquiries about our services.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="bg-gray-800 p-8 rounded-xl shadow-xl"
          >
            <h2 className="text-2xl font-semibold text-white mb-6">Send us a Message</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          {...field}
                          className="bg-gray-700 border-gray-600 text-white"
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
                      <FormLabel className="text-gray-300">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="john@example.com"
                          {...field}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+1 (555) 000-0000"
                          {...field}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Subject</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full p-2 bg-gray-700 border-gray-600 text-white rounded-md focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select a subject</option>
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="Technical Support">Technical Support</option>
                          <option value="Billing">Billing</option>
                          <option value="Partnership">Partnership</option>
                        </select>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="How can we help you?"
                          {...field}
                          className="bg-gray-700 border-gray-600 text-white min-h-[120px]"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </Form>
          </motion.div>

          {/* Contact Information Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            {/* Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-6 rounded-xl shadow-xl">
                <Mail className="h-8 w-8 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Email Us</h3>
                <p className="text-gray-300">support@financefusion.com</p>
                <p className="text-gray-300">info@financefusion.com</p>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl shadow-xl">
                <Phone className="h-8 w-8 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Call Us</h3>
                <p className="text-gray-300">+1 (555) 123-4567</p>
                <p className="text-gray-300">+1 (555) 987-6543</p>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl shadow-xl">
                <MapPin className="h-8 w-8 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Visit Us</h3>
                <p className="text-gray-300">123 Finance Street</p>
                <p className="text-gray-300">New York, NY 10001</p>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl shadow-xl">
                <Clock className="h-8 w-8 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Working Hours</h3>
                <p className="text-gray-300">Mon - Fri: 9:00 AM - 6:00 PM</p>
                <p className="text-gray-300">Sat: 10:00 AM - 4:00 PM</p>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-xl">
              <h3 className="text-xl font-semibold text-white mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="p-2 bg-gray-700 rounded-full hover:bg-blue-500 transition-colors"
                >
                  <Facebook className="h-6 w-6 text-white" />
                </a>
                <a
                  href="#"
                  className="p-2 bg-gray-700 rounded-full hover:bg-blue-400 transition-colors"
                >
                  <Twitter className="h-6 w-6 text-white" />
                </a>
                <a
                  href="#"
                  className="p-2 bg-gray-700 rounded-full hover:bg-blue-600 transition-colors"
                >
                  <Linkedin className="h-6 w-6 text-white" />
                </a>
                <a
                  href="#"
                  className="p-2 bg-gray-700 rounded-full hover:bg-pink-500 transition-colors"
                >
                  <Instagram className="h-6 w-6 text-white" />
                </a>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-xl">
              <h3 className="text-xl font-semibold text-white mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border border-gray-700 rounded-lg overflow-hidden"
                  >
                    <button
                      className="w-full p-4 text-left flex justify-between items-center bg-gray-700 hover:bg-gray-600 transition-colors"
                      onClick={() => setActiveFAQ(activeFAQ === index ? null : index)}
                    >
                      <span className="text-white font-medium">{faq.question}</span>
                      {activeFAQ === index ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                    {activeFAQ === index && (
                      <div className="p-4 bg-gray-800">
                        <p className="text-gray-300">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactUs;