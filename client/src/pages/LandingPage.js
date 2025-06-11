import React ,{useEffect}from 'react';

const LandingPage = () => {
  useEffect(() =>{
    document.body.style.overflow='hidden';
    return()=>{
      document.body.style.overflow='auto';
    };
  },[]);
  return (
    <div
      className="w-screen h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/assets/women-saftey.jpg')"
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-center px-6">
        <div>
          <h1 className="text-4xl md:text-6xl text-white font-bold mb-4">Welcome to SheSecure</h1>
          <p className="text-lg md:text-2xl text-white">
            Empowering Women’s Safety — Anytime, Anywhere
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;