"use client";
import { useEffect, useState, useRef } from "react";
import {
  GoogleMap,
  Marker,
  HeatmapLayer,
  MarkerF,
  InfoWindowF,
} from "@react-google-maps/api";
import { darkBlueMapStyle, darkRedMapStyle } from "@/libs/map-styles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar";
import { MapProvider } from "@/components/MapProvider";

const containerStyle = {
  width: "100%",
  height: "500px",
};

export default function CrimeMap() {
  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: 23.8103,
    lng: 90.4125,
  });

  const [crimes, setCrimes] = useState<any[]>([]);
  const [selectedCrime, setSelectedCrime] = useState<any | null>(null);
  const [mapType, setMapType] = useState<"map" | "heatmap">("map");

  useEffect(() => {
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          setCenter({ lat: 23.8103, lng: 90.4125 });
        },
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  useEffect(() => {
    const fetchCrimes = async () => {
      try {
        const response = await fetch(
          `/api/report?lat=${center.lat}&lng=${center.lng}&radius=10`
        );
        const data = await response.json();
        setCrimes(data.contents);
      } catch (error) {
        console.log("Error fetching crime reports:", error);
      }
    };
    fetchCrimes();
  }, [center]);

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
              <div className="py-4">
                <select
                  name="map"
                  id="map"
                  className="border border-opacity-30 py-2 px-4 rounded"
                  onChange={(e) => setMapType(e.target.value as any)}
                >
                  <option value="map">Location-wise Crime</option>
                  <option value="heatmap">Heatmap</option>
                </select>
              </div>

              <div className="h-[600px] w-full rounded-lg overflow-hidden">
                <MapProvider>
                  {mapType === "map" ? (
                    <GenericMap
                      center={center}
                      crimes={crimes}
                      selectedCrime={selectedCrime}
                      setSelectedCrime={setSelectedCrime}
                    />
                  ) : (
                    <CrimeHeatMap center={center} crimes={crimes} />
                  )}
                </MapProvider>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function CrimeHeatMap({
  center,
  crimes,
}: {
  center: { lat: number; lng: number };
  crimes: any[];
}) {
  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={15}
      options={darkRedMapStyle}
    >
      <HeatmapLayer
        data={crimes.map(
          (crime) =>
            new google.maps.LatLng(
              crime.location.coordinates[1],
              crime.location.coordinates[0]
            )
        )}
        options={{
          radius: 30,
          opacity: 0.6,
        }}
      />
    </GoogleMap>
  );
}

function GenericMap({
  center,
  crimes,
  selectedCrime,
  setSelectedCrime,
}: {
  center: { lat: number; lng: number };
  crimes: any[];
  selectedCrime: any;
  setSelectedCrime: (crime: any) => void;
}) {
  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={15}
      options={darkBlueMapStyle}
    >
      <Marker position={center} />
      {crimes.map((crime) => (
        <MarkerF
          key={crime._id}
          position={{
            lat: crime.location.coordinates[1],
            lng: crime.location.coordinates[0],
          }}
          icon={{
            url: "/marker.png",
            scaledSize: new google.maps.Size(30, 30),
          }}
          onClick={() => setSelectedCrime(crime)}
        />
      ))}
      {selectedCrime && (
        <InfoWindowF
          position={{
            lat: selectedCrime.location.coordinates[1],
            lng: selectedCrime.location.coordinates[0],
          }}
          onCloseClick={() => setSelectedCrime(null)}
        >
          <div className="bg-zinc-900 text-white rounded shadow-lg p-6 border border-zinc-700 max-w-md">
            <h3 className="text-lg font-semibold text-blue-300 mb-2">
              {selectedCrime.title}
            </h3>
            <p className="text-gray-300 mb-4">{selectedCrime.description}</p>

            <div className="border-t border-zinc-700 pt-4">
              <p className="text-gray-400">
                <strong className="text-white">📍 Location:</strong>{" "}
                {selectedCrime.location_name}
              </p>
              <p className="text-gray-400 mt-2 text-xs">
                <strong className="text-white">🚨 Status:</strong>{" "}
                <span
                  className={`px-2 py-1 font-medium rounded ${
                    selectedCrime.status === "fake"
                    ? "bg-red-600 text-white"
                    : selectedCrime.status === "verified"
                    ? "bg-green-600 text-white"
                    : selectedCrime.status === "resolved"
                    ? "bg-blue-600 text-white"
                    : selectedCrime.status === "investigating"
                    ? "bg-yellow-600 text-black"
                    : selectedCrime.status == "not verified"
                    ? "bg-gray-600 text-white"
                    : ""
                  }`}
                >
                  {selectedCrime.status}
                </span>
              </p>
            </div>
          </div>
        </InfoWindowF>
      )}
    </GoogleMap>
  );
}
