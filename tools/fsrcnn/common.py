from __future__ import annotations

import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
LOCAL_FSRCNN_DIR = ROOT / "FSRCNN_x"
CLONED_FSRCNN_DIR = ROOT / "models" / "Super_Resolution" / "FSRCNN_x"
FSRCNN_DIR = LOCAL_FSRCNN_DIR if LOCAL_FSRCNN_DIR.exists() else CLONED_FSRCNN_DIR
ARTIFACTS_DIR = ROOT / "artifacts" / "fsrcnn"


def add_fsrcnn_to_path() -> None:
    if not FSRCNN_DIR.exists():
        raise FileNotFoundError(f"FSRCNN source folder not found: {FSRCNN_DIR}")
    sys.path.insert(0, str(FSRCNN_DIR))


def ensure_artifacts_dir() -> Path:
    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
    return ARTIFACTS_DIR


def require_weights(path: str | Path) -> Path:
    weights = Path(path)
    if not weights.exists():
        raise FileNotFoundError(
            f"Weight file not found: {weights}\n"
            "The cloned FSRCNN_x repo does not include pretrained weights. "
            "Train the model first or provide a compatible .pth file."
        )
    return weights
