import torch
import torch.nn as nn
from torch.serialization import add_safe_globals
add_safe_globals([torch.nn.modules.container.Sequential])

class EfficientADModel(nn.Module):
    def __init__(self):
        super().__init__()

        self.teacher = torch.load("app/models/efficientAD/teacher_final.pth", map_location="cpu", weights_only=False)
        self.student = torch.load("app/models/efficientAD/student_final.pth", map_location="cpu", weights_only=False)
        self.autoencoder = torch.load("app/models/efficientAD/autoencoder_final.pth", map_location="cpu", weights_only=False)

        self.teacher.eval()
        self.student.eval()
        self.autoencoder.eval()
        
    @torch.no_grad()
    def forward(self, x):
        """
        Giriş: x → [1, 3, 256, 256]
        Çıkış: anomaly_map → [1, 256, 256]
        """
        teacher_out = self.teacher(x)
        student_out = self.student(x)
        ae_out = self.autoencoder(x)

        # Ayrıştır: ilk 384 kanal → pdn feature, son 384 → AE reconstruction
        st_part = student_out[:, :384]
        ae_part = student_out[:, 384:]

        map_st = torch.mean((teacher_out - st_part) ** 2, dim=1, keepdim=True)
        map_ae = torch.mean((ae_out - ae_part) ** 2, dim=1, keepdim=True)

        map_combined = 0.5 * map_st + 0.5 * map_ae  # [1, 1, H, W]
        return map_combined.squeeze(1)  # [1, H, W]
