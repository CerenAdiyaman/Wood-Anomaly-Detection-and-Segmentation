import React, { useState } from 'react';

interface Props {
  onUpload: (files: File[], modelName: string) => void;
  isLoading: boolean;
}

const ImageUploadWithModel: React.FC<Props> = ({ onUpload, isLoading }) => {
  const [selectedModel, setSelectedModel] = useState('efficientad');
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = () => {
    if (files.length > 0 && selectedModel) {
      onUpload(files, selectedModel);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <label className="block mb-2 font-semibold">Model Seç:</label>
      <select
        value={selectedModel}
        onChange={e => setSelectedModel(e.target.value)}
        className="mb-4 p-2 border rounded"
        disabled={isLoading}>
        <option value="efficientad">EfficientAD</option>
        {/* Yeni model eklenirse buraya ekle */}
      </select>
      <input
        type="file"
        multiple
        accept="image/png, image/jpeg"
        onChange={handleFileChange}
        disabled={isLoading}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        disabled={isLoading || files.length === 0}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {isLoading ? 'Yükleniyor...' : 'Yükle'}
      </button>
    </div>
  );
};

export default ImageUploadWithModel;