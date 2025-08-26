import React from 'react';
import { useCameraContext } from '../context/CameraContext';

const ResultDisplay = () => {
  const { capturedImage } = useCameraContext();

  return (
    <div className="p-6 border-t border-gray-700">
      <h2 className="text-xl font-semibold text-center mb-4">¡Foto Capturada!</h2>
      <div className="flex justify-center mb-4">
        <img src={capturedImage} className="rounded-lg shadow-lg max-w-full h-auto" alt="Foto capturada con marco" />
      </div>
      <a 
        href={capturedImage} 
        download="foto-con-marco.png" 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg text-lg flex items-center justify-center"
      >
        {/* SVG */}
        Descargar Foto
      </a>
    </div>
  );
};

export default ResultDisplay;