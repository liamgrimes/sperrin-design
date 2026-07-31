from PIL import Image, ImageOps
from pathlib import Path

ROOT = Path(r"C:\git\sperrin-design\assets\images\Available_Pieces")
MAX_SIDE = 1600
QUALITY = 82
IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp"}


def optimise_path(path: Path) -> None:
    with Image.open(path) as img:
        img = ImageOps.exif_transpose(img)

        if path.suffix.lower() in {".jpg", ".jpeg", ".webp"}:
            if img.mode in {"RGBA", "LA", "P"}:
                img = img.convert("RGB")
        elif path.suffix.lower() == ".png":
            if img.mode in {"RGB", "L"}:
                pass
            else:
                img = img.convert("RGBA")

        if max(img.size) > MAX_SIDE:
            img.thumbnail((MAX_SIDE, MAX_SIDE), Image.Resampling.LANCZOS)

        tmp_path = path.with_suffix(path.suffix + ".tmp")
        if path.suffix.lower() in {".jpg", ".jpeg", ".webp"}:
            img.save(tmp_path, format="JPEG", quality=QUALITY, optimize=True, progressive=True)
        else:
            img.save(tmp_path, format="PNG", optimize=True)
        tmp_path.replace(path)


def main() -> None:
    subfolders = sorted([p for p in ROOT.iterdir() if p.is_dir()])
    print(f"Subfolders: {len(subfolders)}")

    for sub in subfolders:
        files = [p for p in sub.rglob("*") if p.is_file() and p.suffix.lower() in IMAGE_EXTS]
        before = sum(p.stat().st_size for p in files)
        print(f"[{sub.name}] files={len(files)} before={before}")

        for file in files:
            try:
                optimise_path(file)
            except Exception as exc:
                print(f"FAIL {file} -> {exc}")

        after = sum(p.stat().st_size for p in files)
        print(f"[{sub.name}] after={after} delta={after - before}")


if __name__ == "__main__":
    main()
