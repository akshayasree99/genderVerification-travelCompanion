import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-100 to-blue-100">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-6 text-purple-600">
          Female-Only Registration App
        </h1>
        
        <p className="text-gray-600 mb-8">
          Welcome to our exclusive platform for female users. Our registration process uses 
          advanced AI to verify your identity before creating an account.
        </p>
        
        <Link 
          to="/registration" 
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default Home;