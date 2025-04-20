import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';

const Camera = ({ onCapture }) => {
  const webcamRef = useRef(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const captureImage = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      onCapture(imageSrc);
    }
  }, [onCapture]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-4 border-2 border-gray-300 rounded-lg overflow-hidden">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={400}
          height={300}
          videoConstraints={{
            facingMode: "user",
          }}
          onUserMedia={() => setIsCameraReady(true)}
          mirrored={true}
          className="rounded-lg"
        />
      </div>
      <button
        onClick={captureImage}
        disabled={!isCameraReady}
        className={`px-4 py-2 rounded-lg ${
          isCameraReady 
            ? 'bg-blue-500 hover:bg-blue-600 text-white' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isCameraReady ? 'Capture Photo' : 'Camera Loading...'}
      </button>
    </div>
  );
};

export default Camera;