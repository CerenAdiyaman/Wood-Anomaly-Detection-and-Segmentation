import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageUploadProps {
  onUpload: (files: File[]) => void;
  isLoading: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUpload, isLoading }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onUpload(acceptedFiles);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    disabled: isLoading
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}
        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input {...getInputProps()} />
      {isLoading ? (
        <p className="text-gray-600">İşleniyor...</p>
      ) : isDragActive ? (
        <p className="text-blue-600">Görselleri buraya bırakın...</p>
      ) : (
        <div>
          <p className="text-gray-600">Görselleri sürükleyip bırakın</p>
          <p className="text-gray-500 text-sm mt-2">veya tıklayarak seçin</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload; 