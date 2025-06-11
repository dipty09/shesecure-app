import React, { useCallback, useRef, useState } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '500px',
};

const center = {
  lat: 20.5937,
  lng: 78.9629,
};

const SafetyMap = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [policeStations, setPoliceStations] = useState([]);
  const mapRef = useRef();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_GOOGLE_MAPS_API_KEY,
    libraries: ['places'], // Important: load Places API
  });

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const current = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(current);
          map.panTo(current);

          // 🔍 Search nearby police stations
          const service = new window.google.maps.places.PlacesService(map);
          const request = {
            location: current,
            radius: 5000,
            type: ['police'],
          };

          service.nearbySearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              setPoliceStations(results);
            }
          });
        },
        (error) => console.error('Geolocation error:', error),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  if (loadError) return <div>❌ Error loading maps</div>;
  if (!isLoaded) return <div>🔄 Loading Maps...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-pink-700">📍 Real-Time Safety Map with Nearby Police Stations</h2>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={15}
        center={userLocation || center}
        onLoad={onMapLoad}
      >
        {/* 👤 User Location */}
        {userLocation && (
          <Marker position={userLocation} label="You" />
        )}

        {/* 🚔 Police Stations */}
        {policeStations.map((place, index) => (
          <Marker
            key={index}
            position={place.geometry.location}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              scaledSize: new window.google.maps.Size(40, 40),
            }}
            title={place.name}
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export default SafetyMap;