import React from "react";
import { useCameraContext } from "../context/CameraContext";
import useIsMobile from "../hooks/useIsMobile";
import { FaFileUpload } from "react-icons/fa";

const Controls = () => {
  const { handleFrameChange, handleCapture, frameName, frameFile } =
    useCameraContext();
  const isFrameSelected = !!frameFile;

  const isMobile = useIsMobile(); // 2. Llama al hook y guarda el resultado en la variable

  return (
    <div className="p-6 gap-5 flex items-center justify-center md:flex-col">
      {isMobile ? (
        <button
          onClick={handleCapture}
          disabled={!isFrameSelected}
          className="bg-white w-26 h-26 rounded-full disabled:bg-gray-500"
        />
      ) : (
        <button
          onClick={handleCapture}
          disabled={!isFrameSelected}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg text-lg transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
        >
          Tomar Foto
        </button>
      )}

      {isMobile ? (
        <button
          onClick={handleCapture}
          disabled={!isFrameSelected}
          className="bg-indigo-600 w-20 h-20 rounded-full"
        >
          <label
            htmlFor="frame-upload"
            className="-rotate-90 cursor-pointer inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium transition-colors hover:bg-indigo-700"
          >
            <FaFileUpload  />
          </label>
          <input
            type="file"
            id="frame-upload"
            accept="image/png"
            onChange={handleFrameChange}
            className="hidden"
          />
        </button>
      ) : (
        <div className="text-center">
          <label
            htmlFor="frame-upload"
            className="cursor-pointer inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium transition-colors hover:bg-indigo-700"
          >
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
      )}
    </div>
  );
};

export default Controls;
