"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Marquee } from '../../components/magicui/marquee';
import { Eye, EyeOffIcon, Loader2, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LoginFormData {
  email: string;
  password: string;
}

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [attempts, setAttempts] = useState(0);
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");

  const images = [
    { name: "Help1", img: "/ss-1.PNG", alt: "Help screenshot 1" },
    { name: "Help2", img: "/ss-2.PNG", alt: "Help screenshot 2" },
    { name: "Help3", img: "/ss-3.PNG", alt: "Help screenshot 3" },
    { name: "Help6", img: "/ss-1.PNG", alt: "Help screenshot 4" },
    { name: "Help4", img: "/ss-4.PNG", alt: "Help screenshot 5" },
    { name: "Help5", img: "/ss-5.PNG", alt: "Help screenshot 6" },
  ];

  useEffect(() => {
    // Clear login attempts after 30 minutes
    const timer = setTimeout(() => setAttempts(0), 1800000);
    return () => clearTimeout(timer);
  }, [attempts]);

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof LoginFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (attempts >= 5) {
      toast.error('Too many login attempts. Please try again later.');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: 'include', // Important for handling cookies
      });

      if (response.ok) {
        const data = await response.json();
        if (!data.error) {
          toast.success("Successfully logged in!");
          window.location.href = returnTo || "/";
        } else {
          setAttempts(prev => prev + 1);
          toast.error("Invalid credentials. Please try again.");
        }
      } else {
        const error = await response.json();
        toast.error(error.error || "An error occurred during login.");
        setAttempts(prev => prev + 1);
      }
    } catch (error) {
      toast.error("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side with 3D Marquee */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="hidden md:w-1/2 bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 p-6 md:p-12 sm:flex flex-col relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />

        <motion.div
          className="text-white relative z-10 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/90"
          >
            সাহায্য
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl font-light text-white/95 leading-relaxed"
          >
            Keeping you up to date with the latest news, articles and more.
          </motion.p>
        </motion.div>

        <div className="relative flex-1 flex flex-col items-center justify-center overflow-hidden">
          <div className="flex flex-row gap-6 [perspective:400px]">
            <Marquee
              className="h-[400px] justify-center overflow-hidden [--duration:45s] [--gap:2rem]"
              vertical
              style={{
                transform: "translateX(0px) translateY(0px) translateZ(-100px) rotateX(8deg) rotateY(-22deg) rotateZ(5deg) scale(1.4)",
              }}
            >
              {images.map((image, idx) => (
                <motion.div
                  key={idx}
                  className="relative group"
                  whileHover={{ scale: 1.05, rotateY: 12 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-600/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                  <img
                    src={image.img}
                    alt={image.alt}
                    className="w-56 h-72 object-cover rounded-lg border border-white/30 shadow-lg transform transition-all duration-500 group-hover:shadow-purple-500/30"
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </Marquee>
          </div>
          <div className="pointer-events-none absolute inset-0 bg-inherit opacity-60" />
        </div>
      </motion.div>

      {/* Right side with login form */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
        className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 bg-gray-50"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          <motion.div
            variants={itemVariants}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-base text-gray-600">Sign in to continue to সাহায্য</p>
          </motion.div>

          <AnimatePresence>
            {attempts >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-4"
              >
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Multiple failed login attempts detected. Please verify your credentials carefully.
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={onSubmit} className="space-y-4">
            <motion.div variants={itemVariants}>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.email ? 'border-red-500' : 'border-gray-200'
                } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-white/80 backdrop-blur-sm text-base shadow-sm`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-500">
                  {errors.email}
                </p>
              )}
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
                  value={formData.password}
                  onChange={handleInputChange}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.password ? 'border-red-500' : 'border-gray-200'
                  } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 bg-white/80 backdrop-blur-sm text-base shadow-sm`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOffIcon size={20} strokeWidth={1.5} />
                  ) : (
                    <Eye size={20} strokeWidth={1.5} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="mt-1 text-sm text-red-500">
                  {errors.password}
                </p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="pt-4">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 15px 20px -8px rgb(0 0 0 / 0.15)" }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || attempts >= 5}
                className="w-full bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 text-white py-2.5 rounded-lg hover:opacity-95 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md text-base relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 size={20} strokeWidth={1.5} className="animate-spin mr-2" />
                    Signing in...
                  </span>
                ) : attempts >= 7 ? (
                  "Too many attempts"
                ) : (
                  "Sign In"
                )}
              </motion.button>

              <motion.div className="flex justify-between items-center mt-4">
                <Link
                  href="/forgot-password"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  Forgot Password?
                </Link>

               
                <Link
                  href="/signup"
                  className="text-blue-600 hover:text-blue-700 font-medium relative inline-block after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600 after:origin-right after:scale-x-0 hover:after:scale-x-100 after:transition-transform duration-300"
                >
                   <p className="text-sm text-gray-600">Don't have an account?</p>
                  Sign Up Now
                </Link>
              </motion.div>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;