from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
from PIL import Image

from common import add_fsrcnn_to_path, ensure_artifacts_dir, require_weights


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--weights", required=True, help="Path to trained FSRCNN_x .pth weights")
    parser.add_argument("--image", required=True, help="Path to source image")
    parser.add_argument("--out", default="", help="Output PNG path")
    parser.add_argument("--scale", type=int, default=2)
    args = parser.parse_args()

    add_fsrcnn_to_path()
    weights = require_weights(args.weights)

    import torch
    from models import FSRCNN_x
    from utils import preprocess, convert_ycbcr_to_rgb

    device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
    model = FSRCNN_x(scale_factor=args.scale).to(device)
    state_dict = model.state_dict()

    for name, param in torch.load(weights, map_location=lambda storage, loc: storage).items():
        if name not in state_dict:
            raise KeyError(name)
        state_dict[name].copy_(param)

    model.eval()

    image = Image.open(args.image).convert("RGB")
    image_width = (image.width // args.scale) * args.scale
    image_height = (image.height // args.scale) * args.scale
    hr = image.resize((image_width, image_height), resample=Image.BICUBIC)
    lr = hr.resize((hr.width // args.scale, hr.height // args.scale), resample=Image.BICUBIC)
    bicubic = lr.resize((lr.width * args.scale, lr.height * args.scale), resample=Image.BICUBIC)

    lr_tensor, _ = preprocess(lr, device)
    _, ycbcr = preprocess(bicubic, device)

    with torch.no_grad():
        preds = model(lr_tensor).clamp(0.0, 1.0)

    preds = preds.mul(255.0).cpu().numpy().squeeze(0).squeeze(0)
    output = np.array([preds, ycbcr[..., 1], ycbcr[..., 2]]).transpose([1, 2, 0])
    output = np.clip(convert_ycbcr_to_rgb(output), 0.0, 255.0).astype(np.uint8)

    out_path = Path(args.out) if args.out else ensure_artifacts_dir() / "sr_output.png"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(output).save(out_path)
    print(f"Saved SR output: {out_path}")


if __name__ == "__main__":
    main()
