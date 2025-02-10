"use client";

import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Marquee } from '../../components/magicui/marquee';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");

  const images = [
    { name: "Help1", img: "/api/placeholder/300/400" },
    { name: "Help2", img: "/api/placeholder/300/400" },
    { name: "Help3", img: "/api/placeholder/300/400" },
    { name: "Help4", img: "/api/placeholder/300/400" },
    { name: "Help5", img: "/api/placeholder/300/400" },
    { name: "Help6", img: "/api/placeholder/300/400" },
  ];

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && !data.error) {
        toast.success("Login successful!");
        window.location.href = returnTo || "/";
      } else {
        toast.error(data.error || "Login failed.");
      }
    } catch (error) {
      toast.error(`Failed to login: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Left side with 3D Marquee */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="md:w-1/2 bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 p-8 md:p-16 flex flex-col relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
        
        <motion.div 
          className="text-white relative z-10 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80"
          >
            সাহায্য
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-2xl font-light text-white/90"
          >
            Helping you succeed, every step of the way
          </motion.p>
        </motion.div>

        <div className="relative flex-1 flex flex-col items-center justify-center overflow-hidden">
          <div className="flex flex-row gap-6 [perspective:400px]">
            <Marquee
              className="h-[500px] justify-center overflow-hidden [--duration:40s] [--gap:2rem]"
              vertical
              style={{
                transform: "translateX(0px) translateY(0px) translateZ(-100px) rotateX(5deg) rotateY(-20deg) rotateZ(5deg) scale(1.6)",
              }}
            >
              {images.map((image, idx) => (
                <motion.div
                  key={idx}
                  className="relative group"
                  whileHover={{ scale: 1.05, rotateY: 10 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-600/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                  <img
                    src={image.img}
                    alt={image.name}
                    className="w-64 h-80 object-cover rounded-xl border border-white/20 shadow-2xl transform transition-all duration-300 group-hover:shadow-purple-500/25"
                  />
                </motion.div>
              ))}
            </Marquee>
          </div>
          <div className="pointer-events-none absolute inset-0 bg-inherit opacity-50" />
        </div>
      </motion.div>

      {/* Right side with login form */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16"
      >
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          <motion.div 
            variants={itemVariants}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Welcome Back</h2>
            <p className="text-lg text-gray-600">Sign in to continue to সাহায্য</p>
          </motion.div>
          
          <form onSubmit={onSubmit} className="space-y-8">
            <motion.div variants={itemVariants}>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                name="username"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white/50 backdrop-blur-sm text-lg"
                placeholder="Enter your username"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative group">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white/50 backdrop-blur-sm text-lg"
                  placeholder="Enter your password"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={showPassword ? "hide" : "show"}
                      initial={{ opacity: 0, rotate: -180 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 180 }}
                      transition={{ duration: 0.2 }}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </motion.button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-4">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 text-white py-4 rounded-xl hover:opacity-90 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-lg relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Please wait...
                  </span>
                ) : (
                  "Sign In"
                )}
              </motion.button>

              <motion.p 
                variants={itemVariants}
                className="text-center text-sm text-gray-600 mt-6"
              >
                Don't have an account?{" "}
                <Link 
                  href="/signup" 
                  className="text-blue-600 hover:text-blue-700 font-medium relative inline-block after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600 after:origin-right after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
                >
                  Sign Up Now
                </Link>
              </motion.p>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;