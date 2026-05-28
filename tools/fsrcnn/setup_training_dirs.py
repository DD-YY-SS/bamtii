from __future__ import annotations

from pathlib import Path

from common import FSRCNN_DIR


def main() -> None:
    required_dirs = ["train_images", "test_images", "train_h5", "test_h5", "outputs"]

    for dirname in required_dirs:
        path = FSRCNN_DIR / dirname
        if path.exists() and path.is_file():
            path.unlink()
        path.mkdir(parents=True, exist_ok=True)
        print(f"ready: {path}")

    data_dir = FSRCNN_DIR / "data"
    train_sample = FSRCNN_DIR / "train_images" / "butterfly_GT.bmp"
    test_sample = FSRCNN_DIR / "test_images" / "butterfly_GT.bmp"
    source_sample = data_dir / "butterfly_GT.bmp"

    if source_sample.exists():
        if not train_sample.exists():
            train_sample.write_bytes(source_sample.read_bytes())
            print(f"copied sample train image: {train_sample}")
        if not test_sample.exists():
            test_sample.write_bytes(source_sample.read_bytes())
            print(f"copied sample eval image: {test_sample}")

    print("FSRCNN training directories are ready.")


if __name__ == "__main__":
    main()
