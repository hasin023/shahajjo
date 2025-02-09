"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUser } from "@/hooks/user"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

export default function Auth() {
    const [isLoading, setIsLoading] = useState(false);
    const [ user, setUser ] = useUser();
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true)
            const formData = new FormData(e.target as HTMLFormElement);
            const data = Object.fromEntries(formData.entries());
            const res = await fetch("/api/auth/login", {
                method: "POST",
                body: JSON.stringify(data),
            })
            const result = await res.json();
            setUser(result.user);
            toast.success("Logged in successfully");
            router.push("/");
        } catch (error) {
            console.log(error);
            toast.error("Failed to login.", (error as any).message);
        } finally {
            setIsLoading(false)
        }
    }

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true)
    }

    return (
        <div className="max-w-md mx-auto pt-12">
            <Tabs defaultValue="login">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="Enter your email" required />
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" placeholder="Enter your password" required />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Logging in..." : "Login"}
                        </Button>
                    </form>
                </TabsContent>
                <TabsContent value="register">
                    <form onSubmit={handleSignUp} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" placeholder="Enter your name" required />
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="Enter your email" required />
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" placeholder="Enter your password" required />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Registering..." : "Register"}
                        </Button>
                    </form>
                </TabsContent>
            </Tabs>
        </div>
    )
}

