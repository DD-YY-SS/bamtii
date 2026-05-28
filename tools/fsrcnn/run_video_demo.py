from __future__ import annotations

import argparse
from pathlib import Path

import imageio.v2 as imageio
import numpy as np
from PIL import Image
from tqdm import tqdm

from common import add_fsrcnn_to_path, require_weights


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--weights", required=True, help="Path to trained FSRCNN_x .pth weights")
    parser.add_argument("--video", required=True, help="Input 360p MP4 path")
    parser.add_argument("--out", required=True, help="Output restored 720p MP4 path")
    parser.add_argument("--scale", type=int, default=2)
    parser.add_argument("--max-frames", type=int, default=0, help="Optional limit for quick previews")
    args = parser.parse_args()

    add_fsrcnn_to_path()
    weights = require_weights(args.weights)

    import torch
    from models import FSRCNN_x
    from utils import convert_ycbcr_to_rgb, preprocess

    device = torch.device("cpu")
    model = FSRCNN_x(scale_factor=args.scale).to(device)
    state_dict = model.state_dict()

    for name, param in torch.load(weights, map_location=lambda storage, loc: storage).items():
        if name not in state_dict:
            raise KeyError(name)
        state_dict[name].copy_(param)

    model.eval()

    input_path = Path(args.video)
    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    reader = imageio.get_reader(input_path)
    metadata = reader.get_meta_data()
    fps = metadata.get("fps", 30)
    duration = metadata.get("duration", 0)
    frame_count = metadata.get("nframes")
    if not isinstance(frame_count, int) or frame_count <= 0:
        frame_count = int(duration * fps) if duration else None
    if args.max_frames > 0:
        frame_count = min(frame_count or args.max_frames, args.max_frames)

    writer = imageio.get_writer(
        out_path,
        fps=fps,
        codec="libx264",
        quality=8,
        macro_block_size=16,
        ffmpeg_params=["-pix_fmt", "yuv420p", "-movflags", "+faststart"],
    )

    try:
        iterator = enumerate(reader)
        progress = tqdm(total=frame_count, desc="FSRCNN video restore")
        for index, frame in iterator:
            if args.max_frames > 0 and index >= args.max_frames:
                break
            restored = restore_frame(frame, model, device, preprocess, convert_ycbcr_to_rgb, args.scale)
            writer.append_data(restored)
            progress.update(1)
        progress.close()
    finally:
        reader.close()
        writer.close()

    print(f"Saved restored video: {out_path}")


def restore_frame(frame, model, device, preprocess, convert_ycbcr_to_rgb, scale: int) -> np.ndarray:
    rgb = Image.fromarray(frame).convert("RGB")
    width = (rgb.width // scale) * scale
    height = (rgb.height // scale) * scale
    source = rgb.resize((width, height), resample=Image.Resampling.BICUBIC)
    bicubic = source.resize((source.width * scale, source.height * scale), resample=Image.Resampling.BICUBIC)

    lr_tensor, _ = preprocess(source, device)
    _, ycbcr = preprocess(bicubic, device)

    import torch

    with torch.no_grad():
        pred_y = model(lr_tensor).clamp(0.0, 1.0)

    pred_y = pred_y.mul(255.0).cpu().numpy().squeeze(0).squeeze(0)
    output = np.array([pred_y, ycbcr[..., 1], ycbcr[..., 2]]).transpose([1, 2, 0])
    output = np.clip(convert_ycbcr_to_rgb(output), 0.0, 255.0).astype(np.uint8)
    return output


if __name__ == "__main__":
    main()
