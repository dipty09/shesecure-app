import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
     <nav className="bg-pink-600 text-white px-4 py-3 shadow-md flex justify-between items-center flex-wrap">
      <div className="flex items-center space-x-2">
       <img src="/assets/logo.jpg" alt="SheSecure Logo" className="h-8 w-8" />
          <h1 className="text-lg font-semibold">SheSecure</h1>
      </div>
      <div className="space-x-4 text-sm sm:text-base mt-2 sm:mt-0">
           <Link className="hover:underline" to="/HomeHero">Home</Link>
              {user ? (
           <>
          <Link className="hover:underline" to="/dashboard">Dashboard</Link>
            <button
             onClick={logout}
             className="ml-2 bg-white text-pink-600 px-3 py-1 rounded hover:bg-pink-100" >
            Logout
            </button>
       </>
    ) : (
      <>
        <Link className="hover:underline" to="/login">Login</Link>
        <Link className="hover:underline" to="/register">Register</Link>
      </>
    )}
  </div>
</nav>
  );
};

export default Navbar;