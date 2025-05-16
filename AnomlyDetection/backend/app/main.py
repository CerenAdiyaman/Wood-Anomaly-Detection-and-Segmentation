from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from typing import List
import base64
import cv2
import numpy as np
from PIL import Image
import io
import torch
from app.model_loader import load_model_by_name
from torchvision import transforms

app = FastAPI(title="Wood Anomaly Detection API")

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Eğitimdeki transform ile birebir aynı
transform = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

def crop_and_clean(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    coords = cv2.findNonZero(thresh)
    if coords is not None:
        x, y, w, h = cv2.boundingRect(coords)
        cropped_image = image[y:y+h, x:x+w]
        gray_cropped = cv2.cvtColor(cropped_image, cv2.COLOR_BGR2GRAY)
        _, clean_thresh = cv2.threshold(gray_cropped, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        new_coords = cv2.findNonZero(clean_thresh)
        if new_coords is not None:
            x2, y2, w2, h2 = cv2.boundingRect(new_coords)
            cropped_image = cropped_image[y2:y2+h2, x2:x2+w2]
        return cropped_image
    return image

def resize_and_normalize(image, target_size=(256, 256)):
    resized_image = cv2.resize(image, target_size)
    normalized_image = resized_image / 255.0
    return normalized_image

def enhance_contrast_clahe(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    equalized = clahe.apply(gray)
    equalized_color = cv2.cvtColor(equalized, cv2.COLOR_GRAY2BGR)
    return equalized_color

def process_image(image):
    cropped_image = crop_and_clean(image)
    enhanced_image = enhance_contrast_clahe(cropped_image)
    final_image = resize_and_normalize(enhanced_image)
    return final_image

@app.post("/predict")
async def predict_anomaly(
    files: List[UploadFile] = File(...),
    modelName: str = Form(...)
):
    try:
        model = load_model_by_name(modelName)
    except ValueError as e:
        return JSONResponse(status_code=400, content={"error": str(e)})

    results = []

    for file in files:
        contents = await file.read()
        original_base64 = base64.b64encode(contents).decode('utf-8')
        original_data_url = f"data:image/jpeg;base64,{original_base64}"

        img_np = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(img_np, cv2.IMREAD_COLOR)

        if img is None:
            print(f"Skipped: {file.filename} could not be read.")
            continue

        processed = process_image(img)
        processed_uint8 = (processed * 255).astype(np.uint8)
        pil_img = Image.fromarray(cv2.cvtColor(processed_uint8, cv2.COLOR_BGR2RGB))
        tensor = transform(pil_img).unsqueeze(0)

        with torch.no_grad():
            anomaly_map = model(tensor)
            anomaly_np = anomaly_map.squeeze().cpu().numpy()

            norm_map = (anomaly_np - anomaly_np.min()) / (anomaly_np.max() - anomaly_np.min() + 1e-8)
            mask = (norm_map > 0.32).astype(np.uint8) * 255
            heatmap = cv2.applyColorMap((norm_map * 255).astype(np.uint8), cv2.COLORMAP_JET)

            _, mask_encoded = cv2.imencode('.png', mask)
            mask_base64 = base64.b64encode(mask_encoded).decode('utf-8')

            _, heatmap_encoded = cv2.imencode('.png', heatmap)
            heatmap_base64 = base64.b64encode(heatmap_encoded).decode('utf-8')

            _, processed_encoded = cv2.imencode('.png', processed_uint8)
            processed_base64 = base64.b64encode(processed_encoded).decode('utf-8')

            results.append({
                "filename": file.filename,
                "model": modelName,
                "f1_score": "-",
                "iou": "-",
                "original": original_data_url,
                "processed": f"data:image/png;base64,{processed_base64}",
                "mask": f"data:image/png;base64,{mask_base64}",
                "heatmap": f"data:image/png;base64,{heatmap_base64}"
            })

    return results

@app.get("/")
async def root():
    return {"message": "Wood Anomaly Detection API is running"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
