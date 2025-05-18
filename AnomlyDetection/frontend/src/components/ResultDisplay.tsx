import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';

interface ResultProps {
  filename: string;
  originalImage: string;
  processedImage: string;
  mask: string;
  heatmap: string;
  anomalyScore: number;
  status: 'Anomalous' | 'Normal';
}

const ResultDisplay: React.FC<ResultProps> = ({
  filename,
  originalImage,
  processedImage,
  mask,
  heatmap,
  anomalyScore,
  status
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="bg-gray-800 hover:bg-gray-700 transition rounded-xl p-4 cursor-pointer shadow-md flex flex-col justify-between w-full"
      >
        <h3 className="text-md font-semibold text-white mb-2">{filename}</h3>

        <div className="flex items-center justify-between mb-2">
          <span
            className={`text-xs px-3 py-1 rounded-full font-semibold ${
              status === 'Anomalous' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
            }`}
          >
            {status}
          </span>
          <span className="text-xs text-gray-400">Anomaly Score: {anomalyScore.toFixed(3)}</span>
        </div>

        <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden mb-4">
          <div
            className={`h-full ${
              anomalyScore > 0.32 ? 'bg-red-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(anomalyScore * 100, 100)}%` }}
          ></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-300 mb-1">Processed</p>
            <img src={processedImage} alt="Processed" className="w-full rounded border border-gray-700" />
          </div>
          <div>
            <p className="text-sm text-gray-300 mb-1">Anomaly Mask</p>
            <img src={mask} alt="Mask" className="w-full rounded border border-gray-700" />
          </div>
          <div>
            <p className="text-sm text-gray-300 mb-1">Heatmap</p>
            <img src={heatmap} alt="Heatmap" className="w-full rounded border border-gray-700" />
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen">
          <div className="fixed inset-0 bg-black bg-opacity-60" />
          <Dialog.Panel className="relative bg-gray-900 text-white rounded-xl max-w-5xl w-full mx-4 p-6 shadow-xl border border-gray-700">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>

            <Dialog.Title className="text-2xl font-bold mb-6">{filename}</Dialog.Title>

            <div className="mb-4 flex items-center justify-between">
              <span
                className={`text-sm px-3 py-1 rounded-full font-semibold ${
                  status === 'Anomalous' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
                }`}
              >
                {status}
              </span>
              <span className="text-sm text-gray-300">Anomaly Score: {typeof anomalyScore === 'number' ? anomalyScore.toFixed(3) : 'N/A'}</span>
            </div>

            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mb-6">
              <div
                className={`h-full ${
                  anomalyScore > 0.17 ? 'bg-red-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(anomalyScore * 100, 100)}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-400 mb-2">Processed</p>
                <img src={processedImage} alt="Processed" className="rounded w-full border border-gray-700" />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-2">Anomaly Mask</p>
                <img src={mask} alt="Mask" className="rounded w-full border border-gray-700" />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-2">Heatmap</p>
                <img src={heatmap} alt="Heatmap" className="rounded w-full border border-gray-700" />
              </div>
            </div>

          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default ResultDisplay;
