"use client";
import React from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Target, 
  Users, 
  Award, 
  Heart, 
  Lightbulb, 
  Shield, 
  TrendingUp, 
  Zap,
  Brain,
  MessageSquare,
  BarChart,
  Wallet
} from "lucide-react";

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Buddhika Roshan",
      role: "CEO & Founder",
      image: "https://scontent.fcmb4-2.fna.fbcdn.net/v/t39.30808-6/466864588_18144369202357709_1507126853386562071_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeG4nL5KK-RywFKgrx75yuviZ3JW-LhZi9Rnclb4uFmL1ExZrfkrpagDkykeiHREy3C_BQ91h4U0DhxyYxTT9xrP&_nc_ohc=wvSD3l2Q3qoQ7kNvwGlv7No&_nc_oc=Admk-NW0srcULcVPVgGJECmQL2D0ADppgvhOMqJA3T2AMZkl5B3FrcY_FqKAaiwbkBqTZv3OdfYZVaKhzJ5mYHds&_nc_zt=23&_nc_ht=scontent.fcmb4-2.fna&_nc_gid=seBg2YgpOBIkF4bfMUjGsA&oh=00_AfIorL4FU61QNx8FBdZdFIjvrxhgiXmTaKnx31A2DozHUg&oe=68242BD3",
      bio: "Former financial advisor with 15+ years of experience in personal finance and fintech innovation."
    },
    {
      name: "Sonali Liyanahetti",
      role: "CTO",
      image: "https://scontent.fcmb4-2.fna.fbcdn.net/v/t39.30808-6/473780534_1108374951067450_8400780161770646698_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeENw7vUNACR-o8lj9oNa4Jbcwz7MPWNw_VzDPsw9Y3D9W_BU6KN-F3jl-WFeQBBecvYTxzxRtfs4CxApWhr5O5Z&_nc_ohc=Ki2Jhc-7XdIQ7kNvwGTM0L7&_nc_oc=AdmoSM-0idVXNOOrq_GtBqfSltciloNlMVoRFoNu9BoN4cTLwjw_dg0a4RZS9KAE81b2CH2grR38XZBsfyHjFPJq&_nc_zt=23&_nc_ht=scontent.fcmb4-2.fna&_nc_gid=c7zD_jfYXRnud4plFq0pHA&oh=00_AfIhnqiW-wJ8QMvBMz5t5pXiZWGVdGFrrgDx7S0VD9qR9g&oe=682424B9",
      bio: "Tech visionary with expertise in AI and machine learning, leading our technical innovation."
    },
    {
      name: "Shamith Udesha",
      role: "Head of Product",
      image: "https://scontent.fcmb4-2.fna.fbcdn.net/v/t39.30808-6/443860157_2105054923210630_1286424738958541343_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFPrkyIpInQ4j1tdvQXLC4BuvWIHZmnsN269Ygdmaew3Q-fmaYITwroROrhnqHlMSncL3Hidf_Ndj4Wkk1BpNDU&_nc_ohc=XB0dROYM_MkQ7kNvwFmY22i&_nc_oc=AdnulP4rHT9KM0bY_4oCZsYFKbI-3nRPpVIKCErmzmWF9QX9P_Tm8nKgInfUPXGirFd8ojPA6jl0myXJUmPZg8Nb&_nc_zt=23&_nc_ht=scontent.fcmb4-2.fna&_nc_gid=zjpcepXqleV9oF0yy3J_ng&oh=00_AfLmyaUIjYj5BcVfWKLIWagB5XrsS71UGWeoE-SGx3YRlw&oe=6824132B",
      bio: "Product strategist focused on creating intuitive and impactful financial management solutions."
    },
    {
      name: "Heshani Niwanthika",
      role: "Lead Developer",
      image: "https://scontent.fcmb4-2.fna.fbcdn.net/v/t39.30808-6/309626200_109934445222101_2980004373931224461_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeF-QcpUk1bHE2R499bUtJoWkmV0g9fZua2SZXSD19m5rYuPohUTcoqZqvx5d5MkY0UKxk4mRQiEd0VTL89H1h1C&_nc_ohc=dos3sb34edAQ7kNvwEbwPFb&_nc_oc=AdnetVxzNvq5kNol3cPLuYgLbJgavHr8xbEMLTEgruAx9MnOl4No7lUwklEXBWayCI4YHAt_BgeedzxoP1fsETLT&_nc_zt=23&_nc_ht=scontent.fcmb4-2.fna&_nc_gid=gM-PHKC_0HthRx7T9JWo-g&oh=00_AfIYERYkggYVXKrBbt2pS4FFSEk8wAzg9a-vqAuIumFM8g&oe=68242278",
      bio: "Full-stack developer passionate about building scalable and secure financial applications."
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "User-Centric",
      description: "We put our users first, designing solutions that truly meet their financial needs."
    },
    {
      icon: Shield,
      title: "Security First",
      description: "Your financial data security is our top priority, with enterprise-grade protection."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Constantly pushing boundaries to bring you the latest in financial technology."
    },
    {
      icon: TrendingUp,
      title: "Growth",
      description: "Committed to helping our users achieve their financial goals and grow their wealth."
    }
  ];

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Leverage AI-driven analytics to gain financial insights and improve your money management."
    },
    {
      icon: MessageSquare,
      title: "Voice & Chat Assistant",
      description: "Interact with FinanceFusion using voice commands and chat for seamless financial tracking."
    },
    {
      icon: BarChart,
      title: "Smart Analytics",
      description: "Get personalized insights and automated categorization of transactions for better planning."
    },
    {
      icon: Wallet,
      title: "Expense Management",
      description: "Easily track and categorize your expenses for better financial control and budgeting."
    }
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
            About FinanceFusion
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Empowering individuals to take control of their financial future through innovative technology and personalized solutions.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="bg-gray-800 rounded-xl shadow-xl p-8 mb-16"
        >
          <div className="flex items-center mb-6">
            <Target className="h-8 w-8 text-blue-400 mr-4" />
            <h2 className="text-2xl font-semibold text-white">Our Mission</h2>
          </div>
          <p className="text-gray-300 text-lg">
            At FinanceFusion, we're on a mission to democratize financial management by making it accessible, intuitive, and effective for everyone. We believe that everyone deserves the tools and knowledge to achieve financial freedom.
          </p>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 * index }}
                className="bg-gray-800 rounded-xl shadow-xl p-6 hover:shadow-2xl transition-shadow"
              >
                <feature.icon className="h-12 w-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 * index }}
                className="bg-gray-800 rounded-xl shadow-xl p-6 hover:shadow-2xl transition-shadow"
              >
                <value.icon className="h-12 w-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{value.title}</h3>
                <p className="text-gray-300">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 * index }}
                className="bg-gray-800 rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow"
              >
                <div className="aspect-w-1 aspect-h-1">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
                  <p className="text-blue-400 mb-3">{member.role}</p>
                  <p className="text-gray-300">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          <div className="bg-gray-800 rounded-xl shadow-xl p-8 text-center hover:shadow-2xl transition-shadow">
            <Users className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-white mb-2">10K+</h3>
            <p className="text-gray-300">Active Users</p>
          </div>
          <div className="bg-gray-800 rounded-xl shadow-xl p-8 text-center hover:shadow-2xl transition-shadow">
            <Award className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-white mb-2">98%</h3>
            <p className="text-gray-300">User Satisfaction</p>
          </div>
          <div className="bg-gray-800 rounded-xl shadow-xl p-8 text-center hover:shadow-2xl transition-shadow">
            <Zap className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-white mb-2">24/7</h3>
            <p className="text-gray-300">Support Available</p>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Join Our Journey</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Be part of our mission to revolutionize personal finance management. Start your journey to financial freedom today.
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all">
            Get Started
          </button>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutUs;