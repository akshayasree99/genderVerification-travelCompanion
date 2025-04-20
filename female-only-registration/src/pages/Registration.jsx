import React, { useState } from 'react';
import FemaleVerification from '../components/FemaleVerification';
import RegistrationForm from '../components/RegistrationForm';
import { Link } from 'react-router-dom';

const Registration = () => {
  const [verificationPassed, setVerificationPassed] = useState(false);

  const handleVerificationComplete = (status) => {
    setVerificationPassed(status);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-blue-100 py-12">
      <div className="max-w-md mx-auto">
        <Link to="/" className="inline-block mb-6 text-blue-600 hover:text-blue-800">
          &larr; Back to Home
        </Link>
        
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {verificationPassed ? 'Complete Your Registration' : 'Female Verification'}
        </h1>
        
        {!verificationPassed ? (
          <FemaleVerification onVerificationComplete={handleVerificationComplete} />
        ) : (
          <RegistrationForm />
        )}
      </div>
    </div>
  );
};

export default Registration;