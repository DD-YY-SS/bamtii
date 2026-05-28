from __future__ import annotations

import argparse
from pathlib import Path

from common import add_fsrcnn_to_path, ensure_artifacts_dir, require_weights


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--weights", required=True, help="Path to trained FSRCNN_x .pth weights")
    parser.add_argument("--out", default="", help="Output ONNX path")
    parser.add_argument("--scale", type=int, default=2)
    parser.add_argument("--height", type=int, default=180)
    parser.add_argument("--width", type=int, default=320)
    args = parser.parse_args()

    add_fsrcnn_to_path()
    weights = require_weights(args.weights)

    import torch
    from models import FSRCNN_x

    model = FSRCNN_x(scale_factor=args.scale)
    state_dict = model.state_dict()

    for name, param in torch.load(weights, map_location=lambda storage, loc: storage).items():
        if name not in state_dict:
            raise KeyError(name)
        state_dict[name].copy_(param)

    model.eval()
    dummy = torch.randn(1, 1, args.height, args.width)

    out_path = Path(args.out) if args.out else ensure_artifacts_dir() / "fsrcnn_x2.onnx"
    out_path.parent.mkdir(parents=True, exist_ok=True)

    torch.onnx.export(
        model,
        dummy,
        out_path,
        input_names=["lr_y"],
        output_names=["sr_y"],
        dynamic_axes={
            "lr_y": {2: "height", 3: "width"},
            "sr_y": {2: "height_x2", 3: "width_x2"},
        },
        opset_version=17,
        dynamo=False,
    )

    print(f"Saved ONNX model: {out_path}")


if __name__ == "__main__":
    main()
