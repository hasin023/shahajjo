"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Sidebar } from "@/components/Sidebar"

const UserProfile = () => {
    const { userId } = useParams()


    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            <main className="flex-1">
                <div className="container mx-auto py-6 px-4 space-y-6">

                    <div>{userId}</div>
                </div>
            </main>
        </div>
    )
}

export default UserProfile