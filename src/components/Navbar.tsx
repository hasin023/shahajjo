"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { usePathname, useRouter } from "next/navigation"
import { AlertCircle, FileText, Home, Map, User, LogOutIcon } from "lucide-react"
import { useUserLoaded, useUser } from "@/hooks/user"
import PushSubscription from "./PushSubscription"

const Navbar = () => {
    const pathname = usePathname()
    const router = useRouter()
    const [user, setUser] = useUser();
    const [userLoaded, _] = useUserLoaded();

    const navItems = [
        { href: "/", label: "Home", icon: Home },
        { href: "/report", label: "Report Crime", icon: AlertCircle },
        { href: "/profile", label: "Profile", icon: User, role: "user" },
        { href: "/admin", label: "Admin", icon: FileText, role: "admin" },
    ]

    function logout() {
        fetch("/api/auth/logout")
            .then((res) => res.json())
            .then((data) => {
                if (!data.error) setUser(null);
            })
            .catch((error) => console.error(error));

        router.push("/");
    }

    return (
        <div className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <nav className="container mx-auto px-4">
                <div className="flex h-14 items-center justify-between">
                    <div className="flex items-center space-x-2">
                        {navItems.map((item) => (
                            !item.role || (user?.role == 'admin' || user?.role == item.role) ? (
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
                            ) : null
                        ))}
                    </div>
                    <div className="flex items-center space-x-4">
                        <PushSubscription/>
                        {/* <NotificationDropdown /> */}
                        <ModeToggle />
                        {
                            !userLoaded ? (
                                <span className="text-xs">Loading..</span>
                            ) :
                                user ? (
                                    <Button variant="outline" onClick={logout} className="hidden sm:flex">
                                        <LogOutIcon size={18} />
                                        <span>Logout</span>
                                    </Button>
                                ) : (
                                    <Button variant="default" className="hidden sm:flex" asChild>
                                        <Link href="/login">Login / Register</Link>
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

