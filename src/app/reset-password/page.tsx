"use client"

import React from 'react';
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

interface ResetPasswordFormData {
    password: string;
    confirmPassword: string;
}

const ResetPasswordPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<ResetPasswordFormData>({
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Password reset successful');
            // Handle success (e.g., redirect or show success message)
        } catch (err) {
            setError('Failed to reset password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center p-4 bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 rounded-full bg-primary/10">
                            <Lock className="w-6 h-6 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
                    <CardDescription className="text-center">
                        Enter your new password below
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label
                                htmlFor="password"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                New Password
                            </label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your new password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full"
                                required
                                minLength={8}
                            />
                        </div>
                        <div className="space-y-2">
                            <label
                                htmlFor="confirmPassword"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Confirm Password
                            </label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm your new password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className="w-full"
                                required
                            />
                        </div>
                        {error && (
                            <div className="text-red-500 text-sm mt-2">{error}</div>
                        )}
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? "Resetting..." : "Reset Password"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ResetPasswordPage;