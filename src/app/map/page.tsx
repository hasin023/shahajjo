"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { addDays } from "date-fns"
import { Sidebar } from "@/components/Sidebar"
import { MapProvider } from "@/components/MapProvider"
import { GoogleMap, Marker } from "@react-google-maps/api"

const containerStyle = {
    width: "100%",
    height: "500px",
  };
  
  const mapOptions = {
    styles: [
      {
        elementType: "geometry",
        stylers: [{ color: "#1a1d2a" }], // Deep blue background
      },
      {
        elementType: "labels.text.fill",
        stylers: [{ color: "#87cefa" }], // Light blue labels
      },
      {
        elementType: "labels.text.stroke",
        stylers: [{ color: "#000000" }], // Dark label outline
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#324a7e" }], // Bluish roads
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#2d6aa3" }], // Vibrant blue water
      },
      {
        featureType: "poi",
        elementType: "geometry",
        stylers: [{ color: "#1f3c5d" }], // Dark blue POIs
      },
    ],
  };
  

export default function CrimeMap() {
    const [center, setCenter] = useState<{ lat: number; lng: number }>({lat: 23.8103, lng: 90.4125});
    
    useEffect(() => {
        if ("geolocation" in navigator) {
          const watchId = navigator.geolocation.watchPosition(
            (position) => {
              const newCenter = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
    
              console.log("New Position:", newCenter); // Debugging
              
              setCenter(newCenter); // Update state
            },
            (error) => {
              console.error("Error fetching location: ", error);
              setCenter({ lat: 23.8103, lng: 90.4125 }); // Default to Dhaka
            },
            {
              enableHighAccuracy: true,
              maximumAge: 5000,
              timeout: 10000,
            }
          );
    
          return () => navigator.geolocation.clearWatch(watchId);
        }
      }, []);

    
    const [dateRange, setDateRange] = useState({
        from: new Date(),
        to: addDays(new Date(), 7),
    })

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1">
                <div className="container mx-auto py-6 px-4 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Crime Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[600px] w-full rounded-lg overflow-hidden">
                               <MapProvider>
                               <GoogleMap
                                    mapContainerStyle={containerStyle}
                                    center={center}
                                    zoom={15}
                                    options={mapOptions}
                                >
                                    <Marker position={center} />
                                </GoogleMap>
                               </MapProvider>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}

