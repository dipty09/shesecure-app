 import { useState, useEffect } from 'react';

const useLocation = () => { 
const [location, setLocation] = useState(null);

useEffect(() => { if (!navigator.geolocation) return;

navigator.geolocation.getCurrentPosition(
  (position) => {
    setLocation({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    });
  },
  () => {
    setLocation(null);
  }
);

}, []);

return location; };

export default useLocation;