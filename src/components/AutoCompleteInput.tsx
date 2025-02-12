import { Address } from "@/types";
import { useEffect, useRef } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface AutoCompleteInputProps {
  address: Address | null;
  setAddress: (address: Address) => void;
  as?: string;
  value?: string;
  placeholder?: string;
  className?: string;
}

export default function AutoCompleteInput({
  address, setAddress, as, value, placeholder, className
}: AutoCompleteInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {componentRestrictions: { country: "bd" }});
    autocomplete.setFields([
      "address_components",
      "formatted_address",
      "geometry",
    ]);
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) {
            if(inputRef.current) inputRef.current.value = "";
            return;
        }

      setAddress({
        location: {
          lng: place.geometry.location.lng(),
          lat: place.geometry.location.lat(),
        },
        name: inputRef.current?.value || place.formatted_address,
      });
    });

    return () => {
        google.maps.event.clearListeners(autocomplete, 'place_changed');
        }
  }, []);
  if(as)
    return (
      <input
      ref={inputRef}
      type="text"
      className={className ? className : `text-ellipsis bg-transparent outline-none border-none block`}
      defaultValue={value || address?.name}
      placeholder={placeholder}
      required
    />
  )

  return (
    <div className="w-full">
      <Label>Location</Label>
      <Input
        ref={inputRef}
        type="text"
        defaultValue={value || address?.name}
        className="w-full"
        placeholder="Search and Select a Location"
        required
      />
    </div>
  );
}
