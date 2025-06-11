import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-white">
      <div className="flex flex-col md:flex-row items-center justify-between px-6 py-12 max-w-6xl mx-auto">
        <div className="md:w-1/2 text-center md:text-left mb-6 md:mb-0">
          <h2 className="text-4xl font-bold text-pink-600 mb-4">Welcome to SheSecure</h2>
          <p className="text-gray-700 text-lg mb-6">
            Empowering Women with Real-Time Safety Solutions. Click SOS in emergencies or add your trusted contacts.
          </p>
          <Link className="inline-block bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition duration-300" to="/register">
            Get Started
          </Link>
        </div>
        <div className="md:w-1/2">
          <img
            src="/assets/hero.jpg"
            alt="Women Safety"
            className="w-full rounded-xl shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;