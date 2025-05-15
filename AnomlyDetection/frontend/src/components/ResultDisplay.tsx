import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';

interface ResultProps {
  filename: string;
  originalImage: string;
  mask: string;
  heatmap: string;
  f1Score: number;
  iou: number;
}

const ResultDisplay: React.FC<ResultProps> = ({
  filename,
  originalImage,
  mask,
  heatmap,
  f1Score,
  iou
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        className="border rounded-lg p-4 mb-4 cursor-pointer hover:shadow-lg transition-shadow"
      >
        <h3 className="text-lg font-extrabold text-gray-900 mb-2">{filename}</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-bold mb-1 text-gray-800">Original</p>
            <img src={originalImage || mask} alt="Original" className="w-full h-32 object-cover rounded" />
          </div>
          <div>
            <p className="text-sm font-bold mb-1 text-gray-800">Anomaly Mask</p>
            <img src={mask} alt="Mask" className="w-full h-32 object-cover rounded" />
          </div>
          <div>
            <p className="text-sm font-bold mb-1 text-gray-800">Heatmap</p>
            <img src={heatmap} alt="Heatmap" className="w-full h-32 object-cover rounded" />
          </div>
        </div>
        <div className="mt-4 flex gap-4">
          <p className="text-sm font-bold text-gray-900">
            <span className="font-extrabold">F1 Score:</span> 
            {/* {typeof f1Score === "number" ? f1Score.toFixed(3) : f1Score} */}
          </p>
          <p className="text-sm font-bold text-gray-900">
            <span className="font-extrabold">IoU:</span> 
            {/* {typeof iou === "number" ? iou.toFixed(3) : iou} */}
          </p>
        </div>
      </div>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="fixed inset-0 bg-black opacity-30" />
          <Dialog.Panel className="relative bg-white rounded-lg max-w-4xl w-full mx-4 p-6">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            
            <Dialog.Title className="text-xl font-extrabold mb-4 text-gray-900">
              {filename}
            </Dialog.Title>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="font-bold mb-2 text-gray-800">Original Image</p>
                <img src={originalImage || mask} alt="Original" className="w-full rounded" />
              </div>
              <div>
                <p className="font-bold mb-2 text-gray-800">Anomaly Mask</p>
                <img src={mask} alt="Mask" className="w-full rounded" />
              </div>
              <div>
                <p className="font-bold mb-2 text-gray-800">Heatmap</p>
                <img src={heatmap} alt="Heatmap" className="w-full rounded" />
              </div>
            </div>

            <div className="mt-6 flex gap-8">
              <p className="font-bold text-gray-900">
                <span className="font-extrabold">F1 Score:</span> {typeof f1Score === "number" ? f1Score.toFixed(3) : f1Score}
              </p>
              <p className="font-bold text-gray-900">
                <span className="font-extrabold">IoU:</span> {typeof iou === "number" ? iou.toFixed(3) : iou}
              </p>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default ResultDisplay; 