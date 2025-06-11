import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
// import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [sosAlerts, setSosAlerts] = useState([]);
  
  useEffect(() => {
    const fetchSosAlerts = async () => {
      try {
        if (user?._id) {
          const res = await axios.get(`/api/sos/user-alerts/${user._id}`);
          setSosAlerts(res.data || []);
        }
      } catch (error) {
        console.error('❌ Failed to fetch SOS alerts:', error);
      }
    };

    fetchSosAlerts();
  }, [user]);

  const totalAlerts = sosAlerts.length;
  const mostRecentDate = sosAlerts[0]?.timestamp
    ? new Date(sosAlerts[0].timestamp).toLocaleDateString()
    : 'N/A';

  return (
    <div className="min-h-screen bg-pink-50 px-4 py-6 sm:px-8">
      {/* Greeting */}
      <h2 className="text-2xl sm:text-3xl font-bold text-pink-700 mb-6">
        Welcome back, {user?.name || 'User'} 👋
      </h2>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <Link to="/sos" className="bg-white shadow rounded-2xl p-6 hover:bg-pink-100 transition">
          <h3 className="text-lg font-semibold text-pink-700"> Trigger SOS</h3>
          <p className="text-gray-600 text-sm mt-2">Send an instant alert with your live location.</p>
        </Link>

        <Link to="/emergency-contacts" className="bg-white shadow rounded-2xl p-6 hover:bg-pink-100 transition">
          <h3 className="text-lg font-semibold text-pink-700">Emergency Contacts</h3>
          <p className="text-gray-600 text-sm mt-2">Add, edit, or remove trusted people.</p>
        </Link>

        <Link to="/SafteyMap" className="bg-white shadow rounded-2xl p-6 hover:bg-pink-100 transition">
          <h3 className="text-lg font-semibold text-pink-700"> Safety Map</h3>
          <p className="text-gray-600 text-sm mt-2">Locate nearby police stations & safe zones.</p>
        </Link>
      </div>

      {/* Insights and Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SOS Activity Stats */}
        <div className="bg-white rounded-2xl p-6 shadow">
          <h4 className="text-lg font-semibold text-pink-700 mb-4"> SOS Activity</h4>
          <p className="text-gray-600 text-sm">Total SOS Alerts Triggered: <strong>{totalAlerts}</strong></p>
          <p className="text-gray-600 text-sm mt-2">Most Recent: <strong>{mostRecentDate}</strong></p>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white rounded-2xl p-6 shadow">
          <h4 className="text-lg font-semibold text-pink-700 mb-4">Recent Alerts</h4>
          <ul className="text-gray-600 text-sm space-y-2">
            {sosAlerts.slice(0, 5).map((alert, index) => (
              <li key={index}>
                {new Date(alert.timestamp).toLocaleDateString()} – Alert triggered
              </li>
            ))}
            {sosAlerts.length === 0 && <li>No recent alerts found</li>}
          </ul>
        </div>
      </div>

      {/* Profile and Settings (Future Enhancement) */}
      <div className="bg-white rounded-2xl p-6 shadow mt-10">
        <h4 className="text-lg font-semibold text-pink-700 mb-4"> Account Settings</h4>
        <p className="text-gray-600 text-sm">Name: {user?.name}</p>
        <p className="text-gray-600 text-sm">Email: {user?.email}</p>
        <p className="text-gray-600 text-sm mt-2">Edit profile feature coming soon...</p>
      </div>
    </div>
  );
};

export default Dashboard;