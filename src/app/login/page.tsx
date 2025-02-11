"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Marquee } from '../../components/magicui/marquee';
import { Eye, EyeOff, Loader2, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from "@/libs/utils";

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
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
        credentials: 'include',
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
    <div className="flex flex-col md:flex-row">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="hidden md:w-1/2 bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 p-6 md:p-12 sm:flex flex-col relative overflow-hidden dark:from-purple-900 dark:via-blue-800 dark:to-cyan-700"
      >
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] dark:bg-black/40" />

        <motion.div
          className="relative z-10 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold mb-4 text-white dark:text-white"
          >
            সাহায্য
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl font-light text-white/95 dark:text-white/90 leading-relaxed"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-600/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg dark:from-purple-900/40" />
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
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
        className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 bg-background"
      >
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-1">
            <CardTitle className="text-3xl md:text-4xl font-bold">Welcome Back</CardTitle>
            <CardDescription>Sign in to continue to সাহায্য</CardDescription>
          </CardHeader>

          <CardContent>
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
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className={cn(
                    errors.email && "border-destructive focus-visible:ring-destructive"
                  )}
                />
                {errors.email && (
                  <p className="text-sm font-medium text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className={cn(
                      errors.password && "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm font-medium text-destructive">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading || attempts >= 5}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : attempts >= 7 ? (
                  "Too many attempts"
                ) : (
                  "Sign In"
                )}
              </Button>

              <div className="flex justify-between items-center">
                <Button variant="link" asChild className="h-auto p-0">
                  <Link href="/reset-password" className="text-primary">
                    Forgot Password?
                  </Link>
                </Button>

                <div className="text-right space-y-1">
                  <p className="text-sm text-muted-foreground">Don't have an account?</p>
                  <Button variant="link" asChild className="h-auto p-0">
                    <Link href="/signup" className="text-primary">
                      Sign Up Now
                    </Link>
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;