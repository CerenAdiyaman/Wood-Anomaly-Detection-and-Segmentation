// Responsive App.tsx with top navbar, centered text, model info
import React, { useState } from 'react';
import { uploadImages } from './services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ResultDisplay from './components/ResultDisplay';

interface Result {
  filename: string;
  original: string;
  mask: string;
  heatmap: string;
  f1_score: number;
  iou: number;
}

const App: React.FC = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('EfficientAD');

  const handleUpload = async (files: File[], modelName: string) => {
    try {
      setLoading(true);
      const response = await uploadImages(files, modelName);
      setResults(response);
      toast.success('Image analysis completed!');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('There was an error uploading the image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* Top Navbar */}
      <nav className="w-full flex justify-between items-center px-6 py-4 bg-gray-950 shadow-md">
        <div className="flex items-center gap-3">
          <img src="/images/woody.png" alt="Woody Logo" className="w-8 h-8" />
          <span className="text-lg font-semibold">Woody</span>
        </div>
        <div className="hidden md:flex gap-6 text-sm text-gray-300">
          <a href="#detect" className="hover:text-white">Detect</a>
          <a href="#models" className="hover:text-white">Model Info</a>
          <a href="#about" className="hover:text-white">About Us</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 py-12 text-center">
        <div className="flex flex-col items-center">
          <img src="/images/wood-hero.png" alt="Illustration" className="w-64 md:w-96 mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Wood Anomaly Detection</h1>
          <p className="text-gray-300 text-base md:text-lg">
            This AI-driven web platform enables automated anomaly detection on wood surfaces by analyzing uploaded images through multiple deep learning models.
            It provides instant visual outputs including anomaly masks and heatmaps, helping in quality control, defect localization, and visual inspection processes in industrial applications.
          </p>
        </div>
      </section>

      {/* Upload Section */}
      <section id="detect" className="w-full max-w-4xl mx-auto bg-gray-800 p-8 rounded-2xl shadow-lg text-center space-y-6 mb-20">
        <h2 className="text-xl font-semibold">Select Model</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {['EfficientAD', 'Model B', 'Model C', 'Model D', 'Model E', 'Model F'].map((model) => (
            <button
              key={model}
              className={`px-4 py-2 rounded-md transition ${selectedModel === model ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-indigo-500'}`}
              onClick={() => {
                setSelectedModel(model);
                toast.info(`${model} selected!`);
              }}
            >
              {model}
            </button>
          ))}
        </div>

        {/* Custom Upload Box */}
        <div className="border-2 border-dashed border-gray-500 rounded-lg p-6 mt-6 bg-gray-700">
          <div className="flex flex-col items-center justify-center">
            <img src="/images/cloud-upload-alt.png" alt="Upload Icon" className="h-12 w-12 opacity-70" />
            <p className="mt-2 text-sm text-gray-300">
              Drag and drop an image here or <label htmlFor="file-upload" className="text-indigo-400 underline cursor-pointer">select a file</label>
            </p>
            <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && selectedModel) {
                handleUpload([file], selectedModel);
              }
            }} />
          </div>
        </div>
      </section>

      {/* Processing Spinner */}
      {loading && (
        <div className="w-full flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-400"></div>
          <span className="ml-4 text-gray-300">Processing...</span>
        </div>
      )}

      {!loading && results.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 mb-20">
          <h2 className="text-2xl font-bold text-center text-white mb-8">Analysis Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((result, index) => (
              <ResultDisplay
                key={index}
                filename={result.filename}
                originalImage={result.original}
                mask={result.mask}
                heatmap={result.heatmap}
                f1Score={result.f1_score}
                iou={result.iou}
              />
            ))}
          </div>
        </section>
      )}


      {/* Model Info Section */}
      <section id="models" className="w-full max-w-4xl mx-auto bg-gray-800 p-6 rounded-2xl shadow-lg text-left mb-20">
        <h3 className="text-lg font-semibold mb-2 text-white">About {selectedModel || 'Selected Model'}</h3>
        <p className="text-sm text-gray-300">
          {selectedModel === 'EfficientAD'
            ? 'EfficientAD is an unsupervised anomaly detection model tailored for wood surfaces. It uses a student–teacher architecture, where the student network learns to mimic the feature representations of a fixed, pretrained teacher network trained on defect-free wood. During inference, discrepancies between the two reveal anomalies. EfficientAD uses patch-wise convolution via a Patch Description Network (PDN) and processes entire images efficiently in a single pass without needing labeled defect data.'
            : selectedModel
            ? `Details about ${selectedModel} will be displayed here.`
            : 'Please select a model above to view its technical details.'}
        </p>
      </section>

      {/* Footer */}
      <footer id="about" className="text-center py-12 text-gray-500 text-sm">
        © 2025 Woody | Developed by Ceren
      </footer>

      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
};

export default App;
