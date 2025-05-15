import React, { useState } from 'react';
import ImageUploadWithModel from './components/ImageUploadWithModel';
import ResultDisplay from './components/ResultDisplay';
import { uploadImages } from './services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Result {
  filename: string;
  mask: string;
  heatmap: string;
  f1_score: number;
  iou: number;
}

const App: React.FC = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (files: File[], modelName: string) => {
    try {
      setLoading(true);
      const response = await uploadImages(files, modelName);
      setResults(response);
      toast.success('Görsel analizi tamamlandı!');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Görsel yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Ahşap Anomali Tespiti</h1>
        <p className="text-gray-600 mb-8">
          Ahşap yüzeylerindeki anomalileri tespit etmek için görsel yükleyin
        </p>
        
        <ImageUploadWithModel onUpload={handleUpload} isLoading={loading} />
        
        {loading && (
          <div className="mt-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Görsel analiz ediliyor...</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">Sonuçlar</h2>
            <div className="grid grid-cols-1 gap-6">
              {results.map((result, index) => (
                <ResultDisplay
                  key={index}
                  filename={result.filename}
                  originalImage=""
                  mask={result.mask}
                  heatmap={result.heatmap}
                  f1Score={result.f1_score}
                  iou={result.iou}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default App;
