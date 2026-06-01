import React, { useState, useEffect } from 'react';
import { geocode } from '../../services/maps/geocodingService';
import AutocompleteList from './AutocompleteList';

export default function SourceInput({ onSelect }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const text = (query || '').trim();
    if (text.length < 3) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const results = await geocode(text);
        setSuggestions(Array.isArray(results) ? results : []);
      } catch (err) {
        console.error(err);
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (place) => {
    console.log('Source selected place:', place);
    if (!place || isNaN(place.lat) || isNaN(place.lng)) {
      console.error('Invalid place:', place);
      return;
    }
    const loc = { lat: place.lat, lng: place.lng, display: place.display };
    setQuery(loc.display);
    setSuggestions([]);
    onSelect(loc);
  };

  return (
    <div style={{ position: 'relative', marginBottom: 8 }}>
      <input
        type="text"
        placeholder="📍 Enter source"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: '100%', padding: 12, border: '1px solid #dee2e6', borderRadius: 8, fontSize: 14 }}
      />
      {suggestions.length > 0 && (
        <AutocompleteList suggestions={suggestions} onSelect={handleSelect} />
      )}
    </div>
  );
}