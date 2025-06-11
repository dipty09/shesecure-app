import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { playPanicSound, stopPanicSound } from '../utils/playPanicSound';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;

const SOS = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);
  const [tracking, setTracking] = useState(false);
  const [panicMode, setPanicMode] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const panicTimeoutRef = useRef(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [location, setLocation] = useState(null);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          };
          setLocation(loc); // store for map
          resolve(loc);
        },
        (err) => reject(err),
        { enableHighAccuracy: true }
      );
    });
  };

  const startLiveLocation = useCallback(() => {
    if (tracking) return;

    const id = setInterval(async () => {
      try {
        const location = await getLocation();
        await api.post('/location/update', {
          userId: user._id,
          location,
        });
        console.log('Location updated:', location);
      } catch (error) {
        console.error('Live tracking error:', error);
      }
    }, 10000);

    setIntervalId(id);
    setTracking(true);
  }, [tracking, user]);

  const handleSOS = useCallback(async () => {
    if (!user) return;
    setSending(true);
    setStatus('');

    try {
      const location = await getLocation();

      let imageBase64 = null;
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        imageBase64 = canvas.toDataURL('image/png');
      }

      await api.post('/sos/send', {
        userId: user._id,
        location,
        image: imageBase64,
      });

      setStatus('✅ SOS sent. Activating Panic Mode...');
      startLiveLocation();

      panicTimeoutRef.current = setTimeout(() => {
        setPanicMode(true);
        playPanicSound();
        setStatus('🚨 Panic Mode Activated. SOS sent & live tracking started.');
      }, 30000);
    } catch (error) {
      console.error('SOS Error:', error);
      setStatus('Failed to send SOS alert.');
    }

    setSending(false);
  }, [user, startLiveLocation]);

  const stopTracking = () => {
    if (intervalId) clearInterval(intervalId);
    setIntervalId(null);
    setTracking(false);
    setPanicMode(false);
    stopPanicSound();
    setStatus('✅ Panic Mode Deactivated. Tracking stopped.');

    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    if (panicTimeoutRef.current) {
      clearTimeout(panicTimeoutRef.current);
      panicTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    if (!recognition) return;

    recognition.continuous = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
      console.log('Heard:', transcript);
      if (transcript.includes('help') || transcript.includes('sos')) {
        handleSOS();
      }
    };

    recognition.onerror = (e) => {
      console.error('Voice recognition error:', e);
    };

    recognition.start();

    return () => recognition.stop();
  }, [handleSOS]);

  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Camera error:', err);
      }
    };

    setupCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  const renderMap = () => {
    if (!location) return null;
    return (
      <div className="mt-4 rounded-xl overflow-hidden border border-gray-200">
        <MapContainer
          center={[location.latitude, location.longitude]}
          zoom={16}
          scrollWheelZoom={false}
          style={{ height: '300px', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[location.latitude, location.longitude]}>
            <Popup>Your Current Location</Popup>
          </Marker>
        </MapContainer>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center h-screen bg-red-50">
      <div className="p-6 bg-white rounded-2xl shadow-xl text-center w-full max-w-md">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">Emergency SOS</h2>
        <p className="mb-4 text-gray-600">
          Tap the button below or say "Help" / "SOS" to trigger emergency alert with location and photo.
        </p>

        <button
          className={`w-full px-4 py-3 font-bold rounded-xl shadow transition duration-200 ${
            panicMode ? 'bg-black text-white hover:bg-gray-800' : 'bg-red-600 text-white hover:bg-red-700'
          }`}
          onClick={handleSOS}
          disabled={sending || tracking}
        >
          {sending
            ? 'Sending...'
            : panicMode
            ? '🚨 Panic Mode Active'
            : tracking
            ? 'Tracking...'
            : 'Send SOS Alert'}
        </button>

        {tracking && (
          <button
            onClick={stopTracking}
            className="w-full mt-4 px-4 py-3 bg-gray-600 text-white font-bold rounded-xl shadow hover:bg-gray-700 transition duration-200"
          >
            Mark as Safe / Stop Tracking
          </button>
        )}

        {status && <p className="mt-4 text-gray-700">{status}</p>}

        {renderMap()}

        <video ref={videoRef} autoPlay playsInline className="hidden" />
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default SOS;