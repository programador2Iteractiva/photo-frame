import React from 'react';
import { useCameraContext } from '../context/CameraContext';

const Controls = () => {
  const { handleFrameChange, handleCapture, frameName, frameFile } = useCameraContext();
  const isFrameSelected = !!frameFile;

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <label htmlFor="frame-upload" className="cursor-pointer inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium transition-colors hover:bg-indigo-700">
          {/* SVG */}
          Elegir Marco (PNG)
        </label>
        <input 
          type="file" 
          id="frame-upload" 
          accept="image/png" 
          onChange={handleFrameChange}
          className="hidden"
        />
        <p className="text-sm text-gray-400 mt-2">{frameName}</p>
      </div>

      <button 
        onClick={handleCapture}
        disabled={!isFrameSelected}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg text-lg transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {/* SVG */}
        Tomar Foto
      </button>
    </div>
  );
};

export default Controls;