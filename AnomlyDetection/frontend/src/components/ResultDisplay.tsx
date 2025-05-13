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
        <h3 className="text-lg font-semibold mb-2">{filename}</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm mb-1">Orijinal</p>
            <img src={originalImage || mask} alt="Original" className="w-full h-32 object-cover rounded" />
          </div>
          <div>
            <p className="text-sm mb-1">Anomali Maskesi</p>
            <img src={mask} alt="Mask" className="w-full h-32 object-cover rounded" />
          </div>
          <div>
            <p className="text-sm mb-1">Isı Haritası</p>
            <img src={heatmap} alt="Heatmap" className="w-full h-32 object-cover rounded" />
          </div>
        </div>
        <div className="mt-4 flex gap-4">
          <p className="text-sm">
            <span className="font-semibold">F1 Score:</span> {f1Score.toFixed(3)}
          </p>
          <p className="text-sm">
            <span className="font-semibold">IoU:</span> {iou.toFixed(3)}
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
            
            <Dialog.Title className="text-xl font-semibold mb-4">
              {filename}
            </Dialog.Title>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="font-medium mb-2">Orijinal Görsel</p>
                <img src={originalImage || mask} alt="Original" className="w-full rounded" />
              </div>
              <div>
                <p className="font-medium mb-2">Anomali Maskesi</p>
                <img src={mask} alt="Mask" className="w-full rounded" />
              </div>
              <div>
                <p className="font-medium mb-2">Isı Haritası</p>
                <img src={heatmap} alt="Heatmap" className="w-full rounded" />
              </div>
            </div>

            <div className="mt-6 flex gap-8">
              <p>
                <span className="font-semibold">F1 Score:</span> {f1Score.toFixed(3)}
              </p>
              <p>
                <span className="font-semibold">IoU:</span> {iou.toFixed(3)}
              </p>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default ResultDisplay; 