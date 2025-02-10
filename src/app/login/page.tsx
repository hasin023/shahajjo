"use client";

import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Marquee } from '../../components/magicui/marquee';
import { Eye, EyeOffIcon, Loader2 } from 'lucide-react';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");

  const images = [
    { name: "Help1", img: "/ss-1.PNG" },
    { name: "Help2", img: "/ss-2.PNG" },
    { name: "Help3", img: "/ss-3.PNG" },
    { name: "Help6", img: "/ss-1.PNG" },
    { name: "Help4", img: "/ss-4.PNG" },
    { name: "Help5", img: "/ss-5.PNG" },
  ];

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
      if (response.ok) {
        const data = await response.json()
        if (!data.error) {
          toast.success("Logged in.")
          window.location.href = returnTo || "/"; // Redirect to / if successful
        } else {
          toast.error("Login failed.")
        }
      } else {
        const error = await response.json()
        toast.error(error.error)
      }
    } catch (error) {
      toast.error("Failed to login. " + error)
    } finally {
      setLoading(false)
    }
  }

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
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side with 3D Marquee */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="hidden md:w-1/2 bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 p-8 md:p-16 sm:flex flex-col relative overflow-hidden"
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
            className="text-lg md:text-xl font-light text-white/90"
          >
            Keeping you up to date with the latest news, articles and more.
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

          <form onSubmit={onSubmit} className="space-y-4">
            <motion.div variants={itemVariants}>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white/50 backdrop-blur-sm text-lg"
                placeholder="Enter your email"
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
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOffIcon size={20} strokeWidth={1.5} />
                  ) : (
                    <Eye size={20} strokeWidth={1.5} />
                  )}
                </button>
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
                    <Loader2 size={24} strokeWidth={1.5} className="animate-spin mr-2" />
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