import torch

class ModelLoader:
    def __init__(self, model_path: str):
        self.model_path = model_path
        self.model = None
        
    def load_model(self):
        # TODO: .pth model yükleme işlemi
        self.model = torch.load(self.model_path)
        self.model.eval()
        
    def predict(self, image):
        # TODO: Model tahmin işlemi
        with torch.no_grad():
            return self.model(image) 