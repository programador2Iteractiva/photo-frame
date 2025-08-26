import React from 'react';

const ResultDisplay = ({ imageDataUrl }) => {
  return (
    <div id="result-container" className="p-6 border-t border-gray-700">
      <h2 className="text-xl font-semibold text-center mb-4">¡Foto Capturada!</h2>
      <div className="flex justify-center mb-4">
        <img id="result-photo" src={imageDataUrl} className="rounded-lg shadow-lg max-w-full h-auto" alt="Foto capturada con marco" />
      </div>
      <a 
        id="download-btn" 
        href={imageDataUrl} 
        download="foto-con-marco.png" 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg text-lg transition-all duration-200 flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Descargar Foto
      </a>
    </div>
  );
};

export default ResultDisplay;