import React from 'react';

const CameraView = ({ videoRef, frameSrc, error }) => {
  return (
    <div id="camera-container" className="relative bg-black flex items-center justify-center aspect-video">
      <video id="camera-feed" ref={videoRef} playsInline autoPlay className="w-full h-full object-cover"></video>
      
      {frameSrc && (
        <img 
          id="frame-overlay" 
          src={frameSrc} 
          className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none" 
          alt="Marco Superpuesto" 
        />
      )}
      
      {error && (
        <div id="camera-error" className="absolute inset-0 flex items-center justify-center text-center p-4 bg-black bg-opacity-70">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default CameraView;