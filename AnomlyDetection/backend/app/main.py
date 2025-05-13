from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from typing import List
import base64
import cv2
import numpy as np
from PIL import Image
import io
import torch

app = FastAPI(title="Wood Anomaly Detection API")

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model yükleme (uygulama başlangıcında bir kere)
model = None  # TODO: Model yükleme işlemi burada yapılacak

@app.post("/predict")
async def predict_anomaly(files: List[UploadFile] = File(...)):
    results = []
    
    for file in files:
        # Görsel okuma ve ön işleme
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        img = cv2.resize(img, (256, 256))
        
        # TODO: Model tahmin işlemleri burada yapılacak
        # Örnek çıktılar (gerçek implementasyonda model çıktıları kullanılacak)
        dummy_mask = np.zeros((256, 256), dtype=np.uint8)
        dummy_heatmap = cv2.applyColorMap(dummy_mask, cv2.COLORMAP_JET)
        
        # Görselleri base64'e çevirme
        _, mask_encoded = cv2.imencode('.png', dummy_mask)
        mask_base64 = base64.b64encode(mask_encoded).decode('utf-8')
        
        _, heatmap_encoded = cv2.imencode('.png', dummy_heatmap)
        heatmap_base64 = base64.b64encode(heatmap_encoded).decode('utf-8')
        
        results.append({
            "filename": file.filename,
            "f1_score": 0.87,  # Örnek değer
            "iou": 0.76,       # Örnek değer
            "mask": f"data:image/png;base64,{mask_base64}",
            "heatmap": f"data:image/png;base64,{heatmap_base64}"
        })
    
    return results

@app.get("/")
async def root():
    return {"message": "Wood Anomaly Detection API is running"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 