"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/libs/utils"
import { ChevronLeft, Home, Map, BarChart2, AlertCircle, Settings, PlusCircle, Menu } from "lucide-react"

const sidebarLinks = [
    {
        title: "Home",
        icon: Home,
        href: "/",
    },
    {
        title: "Crime Map",
        icon: Map,
        href: "/map",
    },
    // {
    //     title: "Statistics",
    //     icon: BarChart2,
    //     href: "/stats",
    // },
    {
        title: "Report Crime",
        icon: AlertCircle,
        href: "/report",
    },
    // {
    //     title: "Settings",
    //     icon: Settings,
    //     href: "/settings",
    // },
    {
        title: "Leaderboard",
        icon: BarChart2,
        href: "/leaderboard",
    },

]

export function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const pathname = usePathname()
    const router = useRouter()

    const handleNewReport = () => {
        router.push("/report")
    }

    return (
        <div
            className={cn(
                "flex flex-col border-r bg-card transition-all duration-300",
                isCollapsed ? "w-[60px]" : "w-[240px]",
            )}
        >
            <div className="flex h-14 items-center justify-between border-b px-3">
                {!isCollapsed && <span className="font-semibold">Navigation</span>}
                <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setIsCollapsed(!isCollapsed)}>
                    {isCollapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </Button>
            </div>
            <ScrollArea className="flex-1">
                <div className="space-y-2 p-2">
                    {sidebarLinks.map((link) => (
                        <Link key={link.href} href={link.href}>
                            <Button
                                variant={pathname === link.href ? "secondary" : "ghost"}
                                className={cn("w-full justify-start", isCollapsed && "justify-center px-2")}
                            >
                                <link.icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                                {!isCollapsed && <span>{link.title}</span>}
                            </Button>
                        </Link>
                    ))}
                </div>
            </ScrollArea>
            <div className="border-t p-2 sticky bottom-0">
                <Button onClick={handleNewReport} variant="outline" className={cn("w-full justify-start", isCollapsed && "justify-center px-2")}>
                    <PlusCircle className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                    {!isCollapsed && <span>New Report</span>}
                </Button>
            </div>
        </div>
    )
}

