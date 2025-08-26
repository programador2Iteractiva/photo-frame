import React from 'react';

const Controls = ({ onFrameChange, onCapture, frameName, isFrameSelected }) => {
  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <label htmlFor="frame-upload" className="cursor-pointer inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium transition-colors hover:bg-indigo-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L6.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          Elegir Marco (PNG)
        </label>
        <input 
          type="file" 
          id="frame-upload" 
          accept="image/png" 
          onChange={onFrameChange}
          className="hidden"
        />
        <p id="frame-name" className="text-sm text-gray-400 mt-2">{frameName}</p>
      </div>

      <button 
        id="capture-btn" 
        onClick={onCapture}
        disabled={!isFrameSelected}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg text-lg transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Tomar Foto
      </button>
    </div>
  );
};

export default Controls;