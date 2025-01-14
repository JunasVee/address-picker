"use client";

import { useState } from "react";
import Map from "@/components/Map";  // Import Map.tsx

export default function HomePage() {
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      <h1 className="text-lg">Select a Location</h1>
      <h2 className="text-sm">Click on the map to select your location</h2>
      <Map setLocation={setLocation}/> {/* ✅ Pass setLocation to Map.tsx */}
      {location && (
        <div>
          <p><strong>Latitude:</strong> {location.lat}</p>
          <p><strong>Longitude:</strong> {location.lng}</p>
          <p><strong>Address:</strong> {location.address}</p>
        </div>
      )}
    </div>
  );
}
