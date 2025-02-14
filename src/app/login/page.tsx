"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { toast } from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"
import { Marquee } from "../../components/magicui/marquee"
import { Eye, EyeOff, Loader2, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/libs/utils"

interface LoginFormData {
  email: string
  password: string
}

const Login = () => {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState<LoginFormData>({ email: "", password: "" })
  const [errors, setErrors] = useState<Partial<LoginFormData>>({})
  const [attempts, setAttempts] = useState(0)
  const searchParams = useSearchParams()
  const returnTo = searchParams.get("returnTo")

  const images = [
    { name: "Help1", img: "/ss-1.PNG", alt: "Help screenshot 1" },
    { name: "Help2", img: "/ss-2.PNG", alt: "Help screenshot 2" },
    { name: "Help3", img: "/ss-3.PNG", alt: "Help screenshot 3" },
    { name: "Help6", img: "/ss-1.PNG", alt: "Help screenshot 4" },
    { name: "Help4", img: "/ss-4.PNG", alt: "Help screenshot 5" },
    { name: "Help5", img: "/ss-5.PNG", alt: "Help screenshot 6" },
  ]

  useEffect(() => {
    const timer = setTimeout(() => setAttempts(0), 1800000)
    return () => clearTimeout(timer)
  }, [])

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof LoginFormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (attempts >= 5) {
      toast.error("Too many login attempts. Please try again later.")
      return
    }

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        if (!data.error) {
          toast.success("Successfully logged in!")
          window.location.href = returnTo || "/"
        } else {
          setAttempts((prev) => prev + 1)
          toast.error("Invalid credentials.")
        }
      } else {
        const error = await response.json()
        toast.error(error.error || "An error occurred during login.")
        setAttempts((prev) => prev + 1)
      }
    } catch (error) {
      toast.error("Network error. Please check your connection.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary/90 to-secondary/90 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
        <div className="relative z-10">
          <h1 className="text-5xl font-bold mb-4 text-white">সাহায্য</h1>
          <p className="text-xl font-light text-white/95 leading-relaxed max-w-md">
            Keeping you up to date with the latest news, articles and more.
          </p>
        </div>
        <div className="relative flex-1 flex items-center justify-center overflow-hidden mt-8">
          <div className="flex flex-row gap-6 [perspective:400px]">
            <Marquee
              className="h-[500px] justify-center overflow-hidden [--duration:45s] [--gap:2rem]"
              vertical
              style={{
                transform:
                  "translateX(0px) translateY(0px) translateZ(-100px) rotateX(8deg) rotateY(-22deg) rotateZ(5deg) scale(1.4)",
              }}
            >
              {images.map((image, idx) => (
                <motion.div
                  key={idx}
                  className="relative group"
                  whileHover={{ scale: 1.05, rotateY: 12 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                  <img
                    src={image.img || "/placeholder.svg"}
                    alt={image.alt}
                    className="w-64 h-80 object-cover rounded-lg border border-white/30 shadow-lg transform transition-all duration-500 group-hover:shadow-primary/30"
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </Marquee>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">Sign in to continue to সাহায্য</CardDescription>
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
                  className={cn(errors.email && "border-destructive focus-visible:ring-destructive")}
                />
                {errors.email && <p className="text-sm font-medium text-destructive">{errors.email}</p>}
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
                    className={cn(errors.password && "border-destructive focus-visible:ring-destructive")}
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
                {errors.password && <p className="text-sm font-medium text-destructive">{errors.password}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={loading || attempts >= 5}>
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
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="flex items-center justify-between w-full">
              <Button variant="link" asChild className="h-auto p-0">
                <Link href="/reset-password" className="text-primary">
                  Forgot Password?
                </Link>
              </Button>
              <Button variant="link" asChild className="h-auto p-0">
                <Link href="/signup" className="text-primary">
                  Sign Up
                </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default Login

