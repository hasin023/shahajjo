import webpush from "web-push";

webpush.setVapidDetails(
    "mailto:shakibalhasan@iut-dhaka.edu",
    process.env.VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
);


export default webpush;