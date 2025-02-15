"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MapPin,
  AlertTriangle,
  Shield,
  Clock,
  ArrowBigUp,
  ArrowBigDown,
  Calendar,
  MoreVertical,
  CircleCheckBig,
  Image,
  ZoomInIcon,
  ZoomOutIcon,
  Edit,
  Trash,
  FileCheck,
  UserCog,
    ShieldAlert,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import type { ICrimeReport } from "@/types";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import ReactPlayer from "react-player";
import toast from "react-hot-toast";

import { useUserLoaded, useUser } from "@/hooks/user";

import {
  StatusUpdateModal,
  SuspicionLevelModal,
} from "./status-suspicion-modals";

const statusIcons = {
  verified: Shield,
  investigating: Clock,
  resolved: CircleCheckBig,
  "not verified": AlertTriangle,
};

const statusColors = {
  verified: "bg-green-500",
  investigating: "bg-yellow-500",
  resolved: "bg-blue-500",
  "not verified": "bg-red-500",
};

interface DetailedCrimeCardProps {
  report: ICrimeReport;
  onVote: (reportId: string, direction: "upvote" | "downvote") => void;
  userVote: "upvote" | "downvote" | null;
  voteCount: number;
  isAuthor: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function DetailedCrimeCard({
  report,
  onVote,
  userVote,
  voteCount,
  isAuthor,
  onEdit,
  onDelete,
}: DetailedCrimeCardProps) {
  const StatusIcon = statusIcons[report.status as keyof typeof statusIcons];

  const [user, setUser] = useUser();
  const [userLoaded, _] = useUserLoaded();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isRequestingPublic, setIsRequestingPublic] = useState(false);

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isSuspicionModalOpen, setIsSuspicionModalOpen] = useState(false);

  const images = report.images || [];
  const videos = report.videos || [];

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleMakePublicRequest = async () => {
    setIsRequestingPublic(true);
    try {
      const response = await fetch(`/api/user/report/anonymous-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ crimeReportId: report._id }),
      });

      if (response.ok) {
        toast.success("Request to make report public has been sent to admins.");
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to send request. Please try again.");
      }
    } catch (error) {
      console.error("Error requesting to make report public:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsRequestingPublic(false);
    }
  };

  const onUpdateStatus = () => {
    setIsStatusModalOpen(true);
  };

  const onSetSuspicionLevel = () => {
    setIsSuspicionModalOpen(true);
  };

  if (!userLoaded) return <div className="text-center">Loading...</div>;
  if (!user) return <div className="text-center">Not logged in</div>;

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold">
                {report.title}
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Reported by •
                <span className="font-semibold">
                  {report.isAnonymous ? "Anonymous" : report.author?.name}
                </span>
                • {formatDistanceToNow(new Date(report.createdAt))} ago
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge
                variant="outline"
                className={`${
                  statusColors[report.status as keyof typeof statusColors]
                } text-white px-2 py-1`}
              >
                <StatusIcon className="w-4 h-4 mr-1" />
                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
              </Badge>
              {(isAuthor || user.role === "admin") && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {/* Author-specific actions */}
                    {isAuthor && (
                      <>
                        <DropdownMenuItem
                          onClick={onEdit}
                          className="cursor-pointer flex items-center"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Report
                        </DropdownMenuItem>
                        {report.isAnonymous && (
                          <DropdownMenuItem
                            onClick={handleMakePublicRequest}
                            className="cursor-pointer flex items-center"
                            disabled={isRequestingPublic}
                          >
                            <UserCog className="w-4 h-4 mr-2" />
                            {isRequestingPublic
                              ? "Requesting..."
                              : "Request Public"}
                          </DropdownMenuItem>
                        )}
                      </>
                    )}

                    {/* Admin-specific actions */}
                    {user.role === "admin" && (
                      <>
                        <DropdownMenuItem
                          onClick={onUpdateStatus}
                          className="cursor-pointer flex items-center"
                        >
                          <FileCheck className="w-4 h-4 mr-2" />
                          Update Status
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={onSetSuspicionLevel}
                          className="cursor-pointer flex items-center"
                        >
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Set Suspicion Level
                        </DropdownMenuItem>
                      </>
                    )}

                    {/* Delete action available to both roles */}
                    <DropdownMenuItem
                      onClick={onDelete}
                      className="cursor-pointer text-red-500 flex items-center"
                    >
                      <Trash className="w-4 h-4 mr-2" />
                      Delete Report
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">{report.description}</p>
                  
                <Badge
                    variant="secondary"
                    className={`gap-1 ${report.suspicionLevel >= 75 ? "text-green-400" : report.suspicionLevel >= 40 ? "text-yellow-400" : "text-red-400"}`}
                    >
                    <ShieldAlert className="h-3 w-3" />
                    Suspicious:{report.suspicionLevel >= 75 ? "Low" : report.suspicionLevel >= 40 ? "Medium" : "High"}
                </Badge>
        <div className="flex items-center space-x-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{report.location_name}</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>
              Reported on{" "}
              {format(new Date(report.createdAt), "MMMM d, yyyy 'at' h:mm a")}
            </span>
          </div>

          {images.length > 0 && (
            <div className="grid gap-2">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative cursor-pointer overflow-hidden rounded-md max-w-lg"
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Evidence ${index + 1}`}
                    className="object-contain w-full  h-full"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Image className="w-8 h-8 text-white" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {videos.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mt-4">
                Video clips ({videos.length})
              </h3>
              <p className="text-muted-foreground">{report.videoDescription}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {videos.map((video, index) => (
                  <div
                    key={index}
                    className="aspect-video rounded-lg overflow-hidden border border-gray-200"
                  >
                    <ReactPlayer
                      url={video}
                      width="100%"
                      height="100%"
                      controls
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center space-x-4 mt-4">
            <button
              onClick={() => onVote(report._id, "upvote")}
              className={`flex items-center space-x-1 ${
                userVote === "upvote"
                  ? "text-green-500"
                  : "text-muted-foreground"
              }`}
            >
              <ArrowBigUp className="w-5 h-5" />
            </button>
            <span>{voteCount}</span>
            <button
              onClick={() => onVote(report._id, "downvote")}
              className={`flex items-center space-x-1 ${
                userVote === "downvote"
                  ? "text-red-500"
                  : "text-muted-foreground"
              }`}
            >
              <ArrowBigDown className="w-5 h-5" />
            </button>
          </div>
        </CardContent>

        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={lightboxIndex}
          slides={images.map((image) => ({ src: image }))}
          plugins={[Zoom]}
          zoom={{
            maxZoomPixelRatio: 5,
            zoomInMultiplier: 2,
          }}
          carousel={{
            preload: 3,
          }}
          render={{
            iconZoomIn: () => <ZoomInIcon />,
            iconZoomOut: () => <ZoomOutIcon />,
          }}
        />
      </Card>

      <StatusUpdateModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        reportId={report._id}
        currentStatus={report.status}
      />

      <SuspicionLevelModal
        isOpen={isSuspicionModalOpen}
        onClose={() => setIsSuspicionModalOpen(false)}
        reportId={report._id}
        currentSuspicionLevel={report.suspicionLevel || 0}
      />
    </>
  );
}
