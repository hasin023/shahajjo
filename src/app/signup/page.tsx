"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { FormEvent, useState } from 'react'
import toast from 'react-hot-toast'

function SignUp() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget);

        const name = formData.get("name") as string
        const email = formData.get("email") as string
        const password = formData.get("password") as string
        const confirmPassword = formData.get("confirm-password") as string

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.")
            setLoading(false)
            return
        }

        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            })

            if (response.ok) {
                const data = await response.json()
                if (!data.error) {
                    router.push("/login");
                    toast.success("Account has been created successfully. Now login to continue.")
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
        <div className="flex justify-center">
            <div className="card w-96 bg-base-100 shadow-xl border mt-20 mb-20">
                <form method='POST' className="card-body" onSubmit={onSubmit}>
                    <h2 className="card-title">Create an Account!</h2>
                    <div className="items-center mt-2">
                        <label className="input input-bordered flex items-center gap-2 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-round"><circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 0 0-16 0" /></svg>
                            <input type="text" className="grow" name='name' placeholder="Username" required />
                        </label>

                        <label className="input input-bordered flex items-center gap-2 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                                <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                                <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                            </svg>
                            <input type="text" className="grow" name='email' placeholder="Email" required />
                        </label>

                        <label className="input input-bordered flex items-center gap-2 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                                <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" />
                            </svg>
                            <input type="password" className="grow" placeholder='Password' name='password' required />
                        </label>

                        <label className="input input-bordered flex items-center gap-2 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                                <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" />
                            </svg>
                            <input type="password" className="grow" placeholder='Re-type Password' name='confirm-password' required />
                        </label>
                    </div>

                    <div className="card-actions justify-end">
                        <button className="btn btn-neutral w-full" disabled={loading}>{loading ? "Registering.." : "Register"}</button>
                    </div>
                    <div className="card-actions justify-end">
                        <Link href={"/login"} className="btn btn-primary w-full">Login</Link>
                    </div>
                </form>

            </div>
        </div>
    )
}

export default SignUp
