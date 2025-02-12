"use client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useUser, useUserLoaded } from "@/hooks/user";

export default function PushSubscription() {
    const [user] = useUser();
    const [userLoaded] = useUserLoaded();
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        fetch("/api/user/notification/subscribe")
        .then(res => res.json())
        .then(data => setIsSubscribed(!!data.subscription))
        .catch(console.error);
    }, [])

    async function subscribe() {
        if (isSubscribed)
            return;

      if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

      const registration = await navigator.serviceWorker.register("/sw.js");
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
      });

      await fetch("/api/user/notification/subscribe", {
        method: "POST",
        body: JSON.stringify({ userId: user?.id, subscription }),
      });
    }

    const onSubscribe = () => {
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") subscribe();
          });
    }
  
  if (!userLoaded) return <span className="text-xs">Loading...</span>
  if (!user) return null;
  return <Button onClick={onSubscribe}>{isSubscribed ? "UnSubscribe" : "Subscribe"}</Button>;
}
