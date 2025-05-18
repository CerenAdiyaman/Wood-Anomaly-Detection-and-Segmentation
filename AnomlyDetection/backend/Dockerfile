FROM python:3.10

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-deps --no-cache-dir nvidia-cusparselt-cu12==0.6.3
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
