"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { FormEvent, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { User, Mail, Lock, Check, X } from 'lucide-react'
import { BackgroundBeams } from '@/components/ui/background-beams'
import { TypewriterEffectSmooth } from '@/components/ui/typewriter-effect'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

function SignUp() {
    const words = [
        { text: "Welcome" },
        { text: "to" },
        { text: "our" },
        { text: "platform", className: "text-blue-500 dark:text-blue-500" }
    ]
    
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    
    const [validations, setValidations] = useState({
        name: false,
        email: false,
        password: false,
        confirmPassword: false
    })

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/

    const getPasswordRequirements = (password: string) => [
        { text: "At least 8 characters", met: password.length >= 8 },
        { text: "One uppercase letter", met: /[A-Z]/.test(password) },
        { text: "One lowercase letter", met: /[a-z]/.test(password) },
        { text: "One number", met: /\d/.test(password) },
        { text: "One special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(password) }
    ]

    const validatePassword = (password: string) => {
        return getPasswordRequirements(password).every(req => req.met)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    // Validate all fields whenever they change
    useEffect(() => {
        setValidations({
            name: formData.name.length >= 3,
            email: emailRegex.test(formData.email),
            password: validatePassword(formData.password),
            confirmPassword: formData.password === formData.confirmPassword && formData.confirmPassword !== ''
        })
    }, [formData])

    const isFormValid = () => {
        return Object.values(validations).every(v => v)
    }

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        if (!isFormValid()) {
            toast.error("Please fill all fields correctly")
            return
        }

        setLoading(true)

        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                }),
            })

            const data = await response.json()

            if (response.ok) {
                toast.success("Account created successfully!")
                router.push("/login")
            } else {
                throw new Error(data.error || 'Failed to create account')
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "An unexpected error occurred")
        } finally {
            setLoading(false)
        }
    }

    const passwordRequirements = getPasswordRequirements(formData.password)

    return (
        <div className="flex flex-col lg:flex-row min-h-screen">
            {/* Form Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-background p-4 sm:p-6 lg:p-12">
                <Card className="w-full max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle className="text-2xl sm:text-3xl font-bold text-center">
                            Create an Account
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={onSubmit} className="space-y-6">
                            <div className="space-y-4">
                                {/* Username field */}
                                <div className="space-y-2">
                                    <Label htmlFor="name">Username</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                                        <Input
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Enter your username"
                                            className={`pl-10 ${formData.name && !validations.name ? 'border-red-500' : ''}`}
                                        />
                                        {formData.name && (
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                {validations.name ? 
                                                    <Check className="h-5 w-5 text-green-500" /> : 
                                                    <X className="h-5 w-5 text-red-500" />
                                                }
                                            </div>
                                        )}
                                    </div>
                                    {formData.name && !validations.name && (
                                        <p className="text-sm text-red-500">Username must be at least 3 characters</p>
                                    )}
                                </div>

                                {/* Email field */}
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="Enter your email"
                                            className={`pl-10 ${formData.email && !validations.email ? 'border-red-500' : ''}`}
                                        />
                                        {formData.email && (
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                {validations.email ? 
                                                    <Check className="h-5 w-5 text-green-500" /> : 
                                                    <X className="h-5 w-5 text-red-500" />
                                                }
                                            </div>
                                        )}
                                    </div>
                                    {formData.email && !validations.email && (
                                        <p className="text-sm text-red-500">Please enter a valid email address</p>
                                    )}
                                </div>

                                {/* Password field */}
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                   

<div className="relative">
    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
    <Input
        id="password"
        name="password"
        type={showPassword ? "text" : "password"}
        value={formData.password}
        onChange={handleInputChange}
        placeholder="Enter your password"
        className={`pl-10 pr-28 ${formData.password && !validations.password ? 'border-red-500' : ''}`}
    />
    <div className="absolute right-0 top-1/2 -translate-y-1/2 flex">
        {formData.password && (
            <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-full px-2 py-2 text-xs hover:bg-transparent"
                onClick={() => {
                    navigator.clipboard.writeText(formData.password)
                    toast.success('Password copied!')
                }}
            >
                Copy
            </Button>
        )}
        <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
        >
            {showPassword ? "Hide" : "Show"}
        </Button>
    </div>
</div>
                                    
                                    {/* Password requirements */}
                                    {formData.password && (
                                        <div className="mt-2">
                                            <ul className="text-sm space-y-1">
                                                {passwordRequirements.map((req, index) => (
                                                    <li key={index} className="flex items-center gap-2">
                                                        {req.met ? (
                                                            <Check className="h-4 w-4 text-green-500" />
                                                        ) : (
                                                            <X className="h-4 w-4 text-red-500" />
                                                        )}
                                                        <span className={req.met ? 'text-green-500' : 'text-red-500'}>
                                                            {req.text}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                {/* Confirm Password field */}
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showPassword ? "text" : "password"}
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            placeholder="Confirm your password"
                                            className={`pl-10 ${formData.confirmPassword && !validations.confirmPassword ? 'border-red-500' : ''}`}
                                        />
                                        {formData.confirmPassword && (
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                {validations.confirmPassword ? 
                                                    <Check className="h-5 w-5 text-green-500" /> : 
                                                    <X className="h-5 w-5 text-red-500" />
                                                }
                                            </div>
                                        )}
                                    </div>
                                    {formData.confirmPassword && !validations.confirmPassword && (
                                        <p className="text-sm text-red-500">Passwords do not match</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Button
                                    type="submit"
                                    disabled={loading || !isFormValid()}
                                    className="w-full"
                                >
                                    {loading ? "Creating Account..." : "Create Account"}
                                </Button>

                                <p className="text-sm text-center text-muted-foreground">
                                    Already have an account?{" "}
                                    <Link 
                                        href="/login" 
                                        className="text-primary hover:underline font-medium"
                                    >
                                        Login
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>

            {/* Welcome Section */}
            <div className="w-full lg:w-1/2 relative bg-background dark:bg-background min-h-[300px] lg:min-h-0">
                <div className="absolute inset-0">
                    <BackgroundBeams />
                </div>
                <div className="relative z-10 flex flex-col justify-center items-center h-full p-6 lg:p-12 text-center">
                    <TypewriterEffectSmooth words={words} />
                    <p className="text-muted-foreground max-w-md mx-auto mb-8 mt-4 text-sm sm:text-base">
                        See Something, Say Something – Report Crime, Ensure Safety!
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignUp