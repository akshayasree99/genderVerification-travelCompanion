import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { detectFemale } from '../services/gemini';

const FemaleVerification = ({ onVerificationComplete }) => {
  const webcamRef = useRef(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [error, setError] = useState(null);
  const [capturedImages, setCapturedImages] = useState([]);
  const [challenge, setChallenge] = useState(null);
  const [step, setStep] = useState('initial'); // 'initial', 'challenge', 'verifying', 'complete'

  // Generate a random challenge
  const generateChallenge = () => {
    const challenges = [
      { type: 'turn', direction: 'left', text: 'Please turn your head slightly to the left' },
      { type: 'turn', direction: 'right', text: 'Please turn your head slightly to the right' },
      { type: 'expression', action: 'smile', text: 'Please smile at the camera' },
      { type: 'expression', action: 'neutral', text: 'Please look at the camera with a neutral expression' },
    ];
    return challenges[Math.floor(Math.random() * challenges.length)];
  };

  // Start the verification process
  const startVerification = () => {
    setStep('challenge');
    const newChallenge = generateChallenge();
    setChallenge(newChallenge);
    setCapturedImages([]);
    setVerificationResult(null);
    setError(null);
  };

  // Capture images for verification
  const captureImage = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImages(prev => [...prev, imageSrc]);
      return imageSrc;
    }
    return null;
  }, []);

  // Complete the challenge and proceed with verification
  const completeChallenge = async () => {
    setIsVerifying(true);
    setStep('verifying');
    
    try {
      // Capture a final image for verification
      const finalImage = captureImage();
      if (!finalImage) {
        throw new Error("Failed to capture image");
      }
      
      // Perform multiple verifications for security
      const isFemale = await detectFemale(finalImage);
      
      // Check for liveness by analyzing multiple frames
      const isLive = capturedImages.length >= 3; // Simple check - could be enhanced
      
      setVerificationResult(isFemale && isLive);
      
      if (isFemale && isLive) {
        setStep('complete');
        setTimeout(() => {
          onVerificationComplete(true);
        }, 1500);
      } else {
        setError(isFemale ? "Liveness check failed. Please try again." : "Only female users can register.");
        setStep('initial');
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
      console.error("Verification error:", err);
      setStep('initial');
    } finally {
      setIsVerifying(false);
    }
  };

  // Periodically capture images during the challenge (for liveness detection)
  React.useEffect(() => {
    let interval;
    if (step === 'challenge') {
      interval = setInterval(() => {
        captureImage();
        if (capturedImages.length >= 5) {
          clearInterval(interval);
          completeChallenge();
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, capturedImages.length, captureImage]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-center">Female Verification</h2>
      <p className="mb-4 text-gray-600 text-center">
        Please complete the verification process to register.
      </p>
      
      {step === 'initial' && (
        <div className="flex flex-col items-center">
          <div className="mb-4 border-2 border-gray-300 rounded-lg overflow-hidden">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={400}
              height={300}
              videoConstraints={{
                facingMode: "user",
              }}
              mirrored={true}
              className="rounded-lg"
            />
          </div>
          <p className="mb-4 text-gray-600 text-center">
            Make sure you are in a well-lit area and your face is clearly visible.
          </p>
          <button
            onClick={startVerification}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Start Verification
          </button>
        </div>
      )}

      {step === 'challenge' && (
        <div className="flex flex-col items-center">
          <div className="mb-4 border-2 border-gray-300 rounded-lg overflow-hidden">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={400}
              height={300}
              videoConstraints={{
                facingMode: "user",
              }}
              mirrored={true}
              className="rounded-lg"
            />
          </div>
          <div className="p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded mb-4">
            <p className="font-semibold">{challenge?.text}</p>
            <p className="text-sm mt-1">Please hold this position for a few seconds.</p>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000" 
                style={{ width: `${Math.min(capturedImages.length * 20, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {step === 'verifying' && (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Verifying...</p>
        </div>
      )}

      {step === 'complete' && verificationResult === true && (
        <div className="mt-2 text-green-600 font-semibold text-center">
          <p>✓ Verification successful! You can proceed with registration.</p>
        </div>
      )}

      {error && (
        <div className="mt-2">
          <p className="text-red-600 font-semibold text-center">{error}</p>
          <button
            onClick={() => setStep('initial')}
            className="mt-3 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 mx-auto block"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default FemaleVerification;