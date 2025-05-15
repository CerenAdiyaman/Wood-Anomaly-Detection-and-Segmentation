# backend/app/model_loader.py
import torch
from app.models.efficientAD.model import EfficientADModel

def load_model_by_name(model_name: str):
    model_map = {
        "efficientad": (EfficientADModel, "app/models/efficientad_model.pth"),
        # "fastflow": (FastFlowModel, "app/models/fastflow_model.pth"),
        # "padim": (PadimModel, "app/models/padim_model.pth"),
        # "patchcore": (PatchCoreModel, "app/models/patchcore_model.pth"),
        # "draem": (DRAEMModel, "app/models/draem_model.pth"),
        # yeni model eklersen buraya da ekle
    }

    if model_name.lower() == "efficientad":
        return EfficientADModel()  # kendi içinde 3 .pth dosyası yükleniyor

    if model_name.lower() not in model_map:
        raise ValueError(f"Model '{model_name}' not found.")

    model_class, path = model_map[model_name.lower()]
    model = model_class()
    model.load_state_dict(torch.load(path, map_location="cpu"))
    model.eval()
    return model
