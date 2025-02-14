"use client";

import AutoCompleteInput from "@/components/AutoCompleteInput";
import { MapProvider } from "@/components/MapProvider";
import { Sidebar } from "@/components/Sidebar";
import { Input } from "@/components/ui/input";
import { Address, IEmergencyContact } from "@/types";
import { useEffect, useState } from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


export default function EmergencyContacts() {
  const [address, setAddress] = useState<Address | null>(null);
  const [contacts, setContacts] = useState<IEmergencyContact[]>([]);
  const [Loading, setLoading] = useState<boolean>(false);
  const [type, setType] = useState<string>("All");

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setAddress({
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
        },
        () => {
          setAddress({
            location: {
              lat: 23.8103,
              lng: 90.4125,
            },
          });
        },
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
      );
    }
  }, []);

  useEffect(() => {
    if (!address || !address.location) return;
    console.log(address);
    setLoading(true);
    fetch(
      `/api/emergency-contacts?lat=${address.location.lat}&lng=${address.location.lng}&type=${type}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setContacts(data.contacts);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [address, type]);

  const changeType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value;
    setType(type);
  };

  const setUpdateStatus = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.checked);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-4">
        <h1 className="text-3xl font-bold text-blue-400">Emergency Contacts</h1>
        <div className="py-4">
        </div>
        <div className="py-4 flex flex-wrap gap-4 justify-between items-center">
          <MapProvider>
            <AutoCompleteInput address={address} setAddress={setAddress} />
          </MapProvider>
          <select
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all hover:bg-gray-100"
            name="type"
            id="type"
            onChange={changeType}
          >
            <option value="All">All</option>
            <option value="Fire Station">Fire Station</option>
            <option value="Police Station">Police Station</option>
            <option value="Hospital">Hospital</option>
          </select>
        </div>

        <div className="p-4">
          {address?.location && <p>Showing emergency contacts near latitude: {address?.location.lat}, longitude: {address?.location.lng}</p>}
        </div>
        <div className="p-4">
          {Loading ? (
            <p>Loading...</p>
          ) : contacts.length === 0 ? (
            <p>No contacts found</p>
          ) : (
            <div className="grid gap-4">
              {contacts.map((contact, i) => (
                <div
                  key={i + contact.name}
                  className={`bg-white bg-opacity-10 p-4 rounded-lg shadow flex gap-4 justify-between`}
                >
                  <div>
                    <h2 className="text-lg font-semibold text-blue-200">
                      {contact.name}
                    </h2>
                    <p className="font-bold text-sm py-1">
                      <a href={`tel:${contact.contact_number}`}>{contact.contact_number}</a>
                    </p>
                    <p className="text-xs py-1">
                      Service:{" "}
                      <span
                        className={`p-1 rounded ${contact.type == "Fire Station"
                          ? "bg-red-600"
                          : contact.type == "Police Station"
                            ? "bg-green-600"
                            : "bg-black"
                          }`}
                      >
                        {contact.type}
                      </span>
                    </p>
                    <p className="text-sm">{contact.address}</p>
                  </div>
                  <div className="text-xs flex items-center justify-center gap-2">
                    <label htmlFor={`contact-${i}`}>Mark as Outdated</label>
                    <Input onChange={setUpdateStatus} type="checkbox" className="w-4" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
