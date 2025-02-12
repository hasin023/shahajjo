"use client"
import { ICrimeReport, IVote } from "@/types"
import { motion } from "framer-motion"
import { ArrowBigDown, ArrowBigUp } from "lucide-react"
import { useEffect, useState } from "react"

interface CrimeCardProps {
    report: ICrimeReport
}

export default function CardVoteVertical({ report }: CrimeCardProps) {
    const [voteCount, setVoteCount] = useState(report.upvotes - report.downvotes);
    const [userVote, setUserVote] = useState<IVote["vote"] | null>(null);
  
    useEffect(() => {
      fetch(`/api/user/report/vote/${report._id}`)
        .then((res) => res.json())
        .then((data: { vote: IVote }) => setUserVote(data?.vote?.vote || null))
        .catch(console.error);
    }, []);
  
    const onVote = async (reportId: string, vote: "upvote" | "downvote") => {
      fetch(`/api/user/report/vote/${reportId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vote }),
      })
        .then((res) => res.json())
        .then((data) => {
          setUserVote(data.vote.vote);
          if (vote == "upvote" && data.message == 'ADDED') setVoteCount(v => v+1)
          if (vote == "downvote" && data.message == 'ADDED') setVoteCount(v => v -1)
          if (vote == "upvote" && data.message == 'REMOVED') setVoteCount(v => v-1)
          if (vote == "downvote" && data.message == 'REMOVED') setVoteCount(v => v +1)
          if(vote == "upvote" && data.message == 'UPDATED') setVoteCount(v => v+2)
          if(vote == "downvote" && data.message == 'UPDATED') setVoteCount(v => v-2)
          console.log(data);
        })
        .catch(console.error);
    };

  return (
    <div className="flex flex-col items-center p-2 bg-muted rounded-l-lg">
        <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onVote(report._id, "upvote")}
            className={`p-1 rounded-full transition-colors ${userVote === "upvote" ? "text-primary" : "text-muted-foreground"
                }`}
        >
            <ArrowBigUp className="h-6 w-6" />
        </motion.button>
        <span className="font-bold text-sm py-1">{voteCount}</span>
        <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onVote(report._id, "downvote")}
            className={`p-1 rounded-full transition-colors ${userVote === "downvote" ? "text-destructive" : "text-muted-foreground"
                }`}
        >
            <ArrowBigDown className="h-6 w-6" />
        </motion.button>
    </div>
  )
}
