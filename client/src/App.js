import React from 'react';
import { Routes, Route,} from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import SOS from './pages/SOS';
import Dashboard from './pages/Dashboard';
import EmergencyContacts from './pages/EmergencyContacts';
import EmergencyContactForm from './components/EmergencyContactForm';
import HomeHero from './components/HomeHero';
import SafteyMap from './pages/SafteyMap';
import "leaflet/dist/leaflet.css";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"element={<LandingPage/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/sos" element={<SOS /> }/>
        <Route path="/safteymap" element={<SafteyMap /> }/>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/HomeHero" element={<HomeHero/>} />
        <Route path="/emergency-contacts"element={<EmergencyContacts/>}/>
        <Route path="/emergency-contacts"element={<EmergencyContactForm/>}/>
      </Routes>
      
    </>
  );
}

export default App;