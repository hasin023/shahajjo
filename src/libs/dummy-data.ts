import { ICrimeReport } from "@/types";

export const crimeReports: ICrimeReport[] = [
    {
        id: "1",
        title: "গুলশান-২ মার্কেটে ডাকাতি",
        description: "একদল সশস্ত্র ব্যক্তি গুলশান-২ মার্কেটে একটি গয়নার দোকান লুট করেছে। পুলিশ ঘটনাটি তদন্ত করছে।",
        location_name: "গুলশান-২, ঢাকা",
        location: {
            type: "Point",
            coordinates: [90.413, 23.7925], // Example coordinates for Gulshan-2, Dhaka
        },
        images: ["/placeholder.svg"],
        reportedBy: "উদ্বিগ্ননাগরিক",
        upvotes: 156,
        downvotes: 0,
        comments: Array(23).fill(""),
        verified: true,
        status: "not verified",
        updatedAt: new Date("2024-02-09T10:00:00"),
        createdAt: new Date("2024-02-09T10:00:00"),
    },
    {
        id: "2",
        title: "মিরপুরে ছিনতাই",
        description: "মিরপুর ১০ নম্বরে এক ব্যক্তিকে ছিনতাইকারীরা আক্রমণ করে তার মোবাইল ফোন এবং মানিব্যাগ নিয়ে গেছে।",
        location_name: "মিরপুর, ঢাকা",
        location: {
            type: "Point",
            coordinates: [90.3654, 23.8041], // Example coordinates for Mirpur, Dhaka
        },
        images: ["/placeholder.svg"],
        reportedBy: "সচেতনবাসী",
        upvotes: 89,
        downvotes: 0,
        comments: Array(12).fill(""),
        verified: false,
        status: "verified",
        updatedAt: new Date("2024-03-15T18:30:00"),
        createdAt: new Date("2024-03-15T18:30:00"),
    },
    {
        id: "3",
        title: "ধানমন্ডিতে গাড়ি চুরি",
        description: "ধানমন্ডি ২৭ নম্বর রোডে একটি পার্ক করা গাড়ি চুরি হয়েছে। পুলিশ সিসিটিভি ফুটেজ পর্যালোচনা করছে।",
        location_name: "ধানমন্ডি, ঢাকা",
        location: {
            type: "Point",
            coordinates: [90.3773, 23.7465], // Example coordinates for Dhanmondi, Dhaka
        },
        images: ["/placeholder.svg"],
        reportedBy: "নিরাপত্তাপ্রেমী",
        upvotes: 120,
        downvotes: 0,
        comments: Array(30).fill(""),
        verified: true,
        status: "investigating",
        updatedAt: new Date("2024-01-22T05:45:00"),
        createdAt: new Date("2024-01-22T05:45:00"),
    },
    {
        id: "4",
        title: "বনানীতে মাদক উদ্ধার",
        description: "বনানী এলাকায় একটি বাড়িতে অভিযান চালিয়ে বিপুল পরিমাণ মাদক উদ্ধার করেছে র‍্যাব।",
        location_name: "বনানী, ঢাকা",
        location: {
            type: "Point",
            coordinates: [90.4042, 23.7984], // Example coordinates for Banani, Dhaka
        },
        images: ["/placeholder.svg"],
        reportedBy: "সতর্কপ্রতিবেশী",
        upvotes: 200,
        downvotes: 0,
        comments: Array(45).fill(""),
        verified: false,
        status: "resolved",
        updatedAt: new Date("2024-04-10T14:20:00"),
        createdAt: new Date("2024-04-10T14:20:00"),
    },
]

export const leaderboardData = [
    { id: 1, name: "মোঃ রফিকুল ইসলাম", avatar: "/placeholder.svg", reports: 15, score: 120 },
    { id: 2, name: "সাবিনা ইয়াসমিন", avatar: "/placeholder.svg", reports: 12, score: 95 },
    { id: 3, name: "আব্দুল করিম", avatar: "/placeholder.svg", reports: 10, score: 80 },
    { id: 4, name: "রেহানা আক্তার", avatar: "/placeholder.svg", reports: 8, score: 65 },
    { id: 5, name: "মোঃ সাইফুল ইসলাম", avatar: "/placeholder.svg", reports: 6, score: 50 },
]