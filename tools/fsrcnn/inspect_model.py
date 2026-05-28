from __future__ import annotations

from common import add_fsrcnn_to_path


def main() -> None:
    add_fsrcnn_to_path()

    import torch
    from models import FSRCNN_x

    model = FSRCNN_x(scale_factor=2)
    total_params = sum(param.numel() for param in model.parameters())
    trainable_params = sum(param.numel() for param in model.parameters() if param.requires_grad)

    dummy = torch.rand(1, 1, 180, 320)
    with torch.no_grad():
      output = model(dummy)

    print("FSRCNN_x x2 loaded")
    print(f"Total parameters: {total_params:,}")
    print(f"Trainable parameters: {trainable_params:,}")
    print(f"Input shape: {tuple(dummy.shape)}")
    print(f"Output shape: {tuple(output.shape)}")


if __name__ == "__main__":
    main()
