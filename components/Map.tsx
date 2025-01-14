"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import L from 'leaflet';

const fetchAddress = async (lat: number, lng: number): Promise<string> => {
  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
  const data = await response.json();
  return data.display_name as string;
};

const fetchCoordinates = async (query: string): Promise<{ lat: number; lng: number }> => {
  const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
  const data = await response.json();
  if (data.length > 0) {
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  }
  throw new Error("Location not found");
};

// Set the default icon for the marker
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

const MapEvents = ({ setLocation }: { setLocation: (location: { lat: number; lng: number; address: string }) => void }) => {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useMapEvents({
    click: async (e: { latlng: { lat: number; lng: number } }) => {
      const { lat, lng } = e.latlng;
      const address: string = await fetchAddress(lat, lng);
      setPosition([lat, lng]);
      setLocation({ lat, lng, address });
    },
  });

  return position ? <Marker position={position} icon={DefaultIcon} /> : null;
};

export default function Map({ setLocation }: { setLocation: (location: { lat: number; lng: number; address: string }) => void }) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async () => {
    try {
      const { lat, lng } = await fetchCoordinates(searchQuery);
      setPosition([lat, lng]);
      setLocation({ lat, lng, address: searchQuery }); // You might want to fetch the address again if needed
    } catch (error) {
      console.error(error);
      alert("Location not found");
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for a location"
        style={{ margin: "10px", padding: "5px", width: "300px" }}
      />
      <button onClick={handleSearch} style={{ padding: "5px 10px" }}>Search</button>
      <MapContainer center={[-7.2575, 112.7521]} zoom={12} style={{ height: "500px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapEvents setLocation={setLocation} />
        {position && <Marker position={position} icon={DefaultIcon} />}
      </MapContainer>
    </div>
  );
}