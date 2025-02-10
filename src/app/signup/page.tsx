"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { FormEvent, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { User, Mail, Lock, Check, X } from 'lucide-react'
import { BackgroundBeams } from '@/components/ui/background-beams'
import { TypewriterEffectSmooth } from '@/components/ui/typewriter-effect'

function SignUp() {
    const words = [
        { text: "Welcome" },
        { text: "to" },
        { text: "our" },
        { text: "platform", className: "text-blue-500 dark:text-blue-500" }
    ]
    
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordMatch, setPasswordMatch] = useState(true)
    const router = useRouter()

    useEffect(() => {
        if (confirmPassword) {
            setPasswordMatch(password === confirmPassword)
        }
    }, [password, confirmPassword])

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!passwordMatch) {
            toast.error("Passwords do not match.")
            return
        }
        setLoading(true)
        const formData = new FormData(e.currentTarget)
        const name = formData.get("name") as string
        const email = formData.get("email") as string

        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            })

            if (response.ok) {
                const data = await response.json()
                if (!data.error) {
                    router.push("/login")
                    toast.success("Account created successfully!")
                } else {
                    toast.error("Account creation failed.")
                }
            } else {
                const error = await response.json()
                toast.error(error.error)
            }
        } catch (error) {
            toast.error("Failed to create account. " + error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col lg:flex-row min-h-screen">
            {/* Form Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-4 sm:p-6 lg:p-12">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md mx-auto"
                >
                    <form method='POST' className="space-y-4 sm:space-y-6" onSubmit={onSubmit}>
                        <motion.h2 
                            initial={{ y: -20 }}
                            animate={{ y: 0 }}
                            className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-4 sm:mb-6"
                        >
                            Create an Account
                        </motion.h2>

                        <div className="space-y-3 sm:space-y-4">
                            <motion.div 
                                className="relative"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                            >
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input 
                                    type="text" 
                                    name='name' 
                                    placeholder="Username" 
                                    required 
                                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                />
                            </motion.div>

                            <motion.div 
                                className="relative"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input 
                                    type="email" 
                                    name='email' 
                                    placeholder="Email" 
                                    required 
                                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                />
                            </motion.div>

                            <motion.div 
                                className="relative"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    name='password' 
                                    placeholder="Password" 
                                    required 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-16 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </motion.div>

                            <motion.div 
                                className="relative"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    name='confirm-password' 
                                    placeholder="Confirm Password" 
                                    required 
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={`w-full pl-10 pr-10 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border transition-all ${
                                        confirmPassword 
                                            ? passwordMatch 
                                                ? 'border-green-500 focus:ring-2 focus:ring-green-200' 
                                                : 'border-red-500 focus:ring-2 focus:ring-red-200'
                                            : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                    }`}
                                />
                                <AnimatePresence>
                                    {confirmPassword && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            className="absolute right-3 top-1/2 -translate-y-1/2"
                                        >
                                            {passwordMatch 
                                                ? <Check className="text-green-500 h-5 w-5" /> 
                                                : <X className="text-red-500 h-5 w-5" />
                                            }
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </div>

                        <motion.div 
                            className="space-y-4"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <button
                                type="submit"
                                disabled={loading || !passwordMatch}
                                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2.5 sm:py-3 rounded-lg hover:opacity-90 transition-all disabled:opacity-50 text-sm sm:text-base font-medium"
                            >
                                {loading ? "Registering..." : "Create Account"}
                            </button>

                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    Already have an account?{" "}
                                    <Link 
                                        href="/login" 
                                        className="text-blue-600 hover:underline font-medium"
                                    >
                                        Login
                                    </Link>
                                </p>
                            </div>
                        </motion.div>
                    </form>
                </motion.div>
            </div>

            {/* Welcome Section */}
            <div className="w-full lg:w-1/2 relative bg-white min-h-[300px] lg:min-h-0">
                <div className="absolute inset-0">
                    <BackgroundBeams />
                </div>
                <div className="relative z-10 flex flex-col justify-center items-center h-full p-6 lg:p-12 text-center">
                    <TypewriterEffectSmooth words={words} />
                    <p className="text-neutral-400 max-w-md mx-auto mb-8 mt-4 text-sm sm:text-base">
                        See Something, Say Something – Report Crime, Ensure Safety!
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignUp