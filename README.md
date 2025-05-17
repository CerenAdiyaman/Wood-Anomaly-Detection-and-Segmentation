# 🪵 Wood Anomaly Detection & Segmentation

Bu proje, ahşap yüzeylerde anomali tespiti ve segmentasyonu yapabilen bir yapay zeka sistemidir. Frontend React, backend ise FastAPI ile geliştirilmiştir. Docker desteğiyle kolayca çalıştırılabilir.

## 🚀 Özellikler

- Görsel yükleyerek anomaly detection yapma
- EfficientAD tabanlı model desteği
- Segmentasyon maskesi ve ısı haritası (heatmap) üretimi
- F1 Score ve IoU görselleştirmesi
- Tam Docker uyumlu mimari

## 🧱 Proje Yapısı

```
AnomlyDetection/
├── backend/ # FastAPI backend kodları
│ └── app/
│ └──  Dockerfile.backend # Backend için Dockerfile
├── frontend/ # React frontend
│ └── src/
│ └── Dockerfile.frontend # Frontend için Dockerfile
├── docker-compose.yml # Tüm sistemi ayağa kaldıran yapılandırma dosyası
```


## 🐳 Docker ile Çalıştırma

### 1. Repoyu klonlayın

```bash
git clone https://github.com/kullaniciAdi/wood-anomaly-detection.git
cd wood-anomaly-detection
```
2. Docker üzerinden sistemi başlatın
```bash
docker-compose up --build
```
3. Tarayıcıdan erişin

Frontend: http://localhost:3000
Backend (Swagger UI): http://localhost:8000/docs


⚙️ Ortam Değişkeni (Opsiyonel)
Frontend’in backend ile doğru haberleşebilmesi için aşağıdaki ortam değişkeni tanımlanabilir:

.env dosyası (frontend klasörüne):
```
REACT_APP_BACKEND_URL=http://backend:8000
```
.env dosyası .gitignore içinde tutulmalıdır.

🧠 Kullanılan Teknolojiler
PyTorch & EfficientAD

React + TypeScript

FastAPI

Docker & Docker Compose
