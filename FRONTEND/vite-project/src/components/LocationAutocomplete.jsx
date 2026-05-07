import { useState } from "react";
import axios from "axios";

function LocationAutocomplete({ value, onSelect }) {
  const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

  const [suggestions, setSuggestions] = useState([]);

  // Fetch locations from Geoapify
  const fetchLocations = async (query) => {
    if (!query || !API_KEY) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await axios.get(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
          query
        )}&filter=countrycode:in&limit=5&apiKey=${API_KEY}`
      );

      const results = res.data.features || [];

      setSuggestions(results);
    } catch (err) {
      console.log("LOCATION ERROR:", err);
      setSuggestions([]);
    }
  };

  // Handle typing
  const handleChange = (e) => {
    const input = e.target.value;

    onSelect(input, null);

    fetchLocations(input);
  };

  // Handle dropdown selection
  const handleSelect = (place) => {
    const formatted = place.properties.formatted;

    const [lng, lat] = place.geometry.coordinates;

    onSelect(formatted, [lng, lat]);

    setSuggestions([]);
  };

  return (
    <div className="relative w-full">
      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Search location..."
        className="w-full p-3 mb-3 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-500 outline-none"
      />

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="absolute bg-white w-full shadow-lg rounded-lg mt-1 z-50 max-h-60 overflow-y-auto border border-gray-200">
          {suggestions.map((place, index) => (
            <div
              key={index}
              onClick={() => handleSelect(place)}
              className="p-3 hover:bg-blue-100 cursor-pointer text-sm text-black"
            >
              📍 {place.properties.formatted}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LocationAutocomplete;