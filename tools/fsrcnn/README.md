# FSRCNN-x Model Pipeline

This folder wires the cloned `seogihyun/Super_Resolution` FSRCNN-x PyTorch model into this project.

## Current Status

- Preferred source folder: `FSRCNN_x`
- Fallback cloned source folder: `models/Super_Resolution/FSRCNN_x`
- Model architecture: PyTorch `FSRCNN_x`
- Target scale: `x2`, suitable for `360p -> 720p`
- Pretrained weights: not included in the cloned repository
- Local smoke weights: generated at `FSRCNN_x/outputs/x2/best.pth` after `train_smoke.py`

The repository contains example output images, but no pretrained `.pth`, `.pt`, `.onnx`, `.pb`, or `.tflite` weight file. To run real inference, train the model or provide a compatible `best.pth`. The included smoke script trains on the bundled sample image only, so it proves the pipeline works but is not a production-quality SR model.

## Setup

```bash
python -m venv .venv-fsrcnn
.venv-fsrcnn\Scripts\activate
pip install -r tools/fsrcnn/requirements.txt
```

Prepare folders:

```bash
python tools/fsrcnn/setup_training_dirs.py
```

Run this first if `prepare.py` fails with `No such file or directory` for `train_h5` or `test_h5`.

Quick 1-epoch smoke training:

```bash
python tools/fsrcnn/train_smoke.py
```

This creates:

```text
FSRCNN_x/outputs/x2/best.pth
FSRCNN_x/train_h5/train_x2.h5
FSRCNN_x/test_h5/eval_x2.h5
```

## 1. Inspect Model

```bash
python tools/fsrcnn/inspect_model.py
```

This prints the parameter count and verifies that the FSRCNN-x architecture can be loaded.

## 2. Test One Image

After you have a trained weight file:

```bash
python tools/fsrcnn/run_image_demo.py ^
  --weights FSRCNN_x/outputs/x2/best.pth ^
  --image FSRCNN_x/data/butterfly_GT.bmp ^
  --out artifacts/fsrcnn/butterfly_sr.png
```

## 3. Export ONNX

```bash
python tools/fsrcnn/export_onnx.py ^
  --weights FSRCNN_x/outputs/x2/best.pth ^
  --out artifacts/fsrcnn/fsrcnn_x2.onnx
```

The exporter intentionally uses PyTorch's legacy ONNX path (`dynamo=False`) because this tiny FSRCNN model does not need the newer `onnxscript` exporter stack.

## 4. Mobile Conversion Path

Recommended path:

1. Train or obtain `best.pth`.
2. Validate a still image with `run_image_demo.py`.
3. Export ONNX with `export_onnx.py`.
4. Convert ONNX to TFLite or implement PyTorch Mobile/ONNX Runtime Mobile.
5. Integrate into the native SR module.

For the current React Native native module plan, TFLite is still the preferred final format.
