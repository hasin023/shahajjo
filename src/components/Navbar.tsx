"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { usePathname } from "next/navigation"
import { AlertCircle, BarChart2, FileText, Home, Map, User } from "lucide-react"
import { NotificationDropdown } from "./NotificationDropdown"
import { userUserLoaded, useUser } from "@/hooks/user"

const Navbar = () => {
    const pathname = usePathname()
    const [ user ] = useUser();
    const [ userLoaded ] = userUserLoaded();

    const navItems = [
        { href: "/", label: "Home", icon: Home },
        { href: "/report", label: "Report Crime", icon: AlertCircle },
        { href: "/map", label: "Crime Map", icon: Map },
        { href: "/leaderboard", label: "Leaderboard", icon: BarChart2 },
        { href: "/profile", label: "Profile", icon: User, role: "user" },
        { href: "/admin", label: "Admin", icon: FileText, role: "admin" },
    ]

    return (
        <div className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <nav className="container mx-auto px-4">
                <div className="flex h-14 items-center justify-between">
                    <div className="flex items-center space-x-2">
                        {navItems.map((item) => (
                        item.role && user?.role !== item.role ? null : (
                            <Link
                            key={item.href}
                            href={item.href}
                            className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${pathname === item.href
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-accent hover:text-accent-foreground"
                                }`}
                        >
                            <item.icon className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">{item.label}</span>
                        </Link>
                        )
                        ))}
                    </div>
                    <div className="flex items-center space-x-4">
                        <NotificationDropdown />
                        <ModeToggle />
                        {
                            !userLoaded ? (
                                <span className="text-xs">Loading..</span>
                            ) :
                            user ? (
                                <Button variant="default" className="hidden sm:flex">
                                    Logout
                                </Button>
                            ) : (
                                <Button variant="default" className="hidden sm:flex" asChild>
                                    <Link href="/auth">Login / Register</Link>
                                </Button>
                            )
                        }
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar

