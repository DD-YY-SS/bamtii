from __future__ import annotations

import subprocess
import sys

from common import FSRCNN_DIR


def run(command: list[str]) -> None:
    print(" ".join(command))
    subprocess.run(command, check=True)


def main() -> None:
    run([sys.executable, "tools/fsrcnn/setup_training_dirs.py"])
    run([
        sys.executable,
        str(FSRCNN_DIR / "prepare.py"),
        "--images_dir",
        str(FSRCNN_DIR / "train_images"),
        "--output_path",
        str(FSRCNN_DIR / "train_h5" / "train_x2.h5"),
        "--scale",
        "2",
    ])
    run([
        sys.executable,
        str(FSRCNN_DIR / "prepare.py"),
        "--images_dir",
        str(FSRCNN_DIR / "test_images"),
        "--output_path",
        str(FSRCNN_DIR / "test_h5" / "eval_x2.h5"),
        "--scale",
        "2",
        "--eval",
    ])
    run([
        sys.executable,
        str(FSRCNN_DIR / "train.py"),
        "--train_file",
        str(FSRCNN_DIR / "train_h5" / "train_x2.h5"),
        "--eval_file",
        str(FSRCNN_DIR / "test_h5" / "eval_x2.h5"),
        "--outputs_dir",
        str(FSRCNN_DIR / "outputs"),
        "--scale",
        "2",
        "--num_epochs",
        "1",
        "--batch_size",
        "8",
        "--num_workers",
        "0",
    ])


if __name__ == "__main__":
    main()
