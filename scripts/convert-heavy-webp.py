from PIL import Image, ImageOps
from pathlib import Path

ROOT = Path(r"C:\git\sperrin-design\assets\images\Available_Pieces")
MAX_SIDE = 1600
QUALITY = 82
THRESHOLD_BYTES = 250 * 1024


def convert_to_webp(path: Path) -> None:
    webp_path = path.with_suffix(".webp")
    with Image.open(path) as img:
        img = ImageOps.exif_transpose(img)
        if img.mode in {"RGBA", "LA", "P"}:
            img = img.convert("RGB")
        if max(img.size) > MAX_SIDE:
            img.thumbnail((MAX_SIDE, MAX_SIDE), Image.Resampling.LANCZOS)
        img.save(webp_path, format="WEBP", quality=QUALITY, method=6, lossless=False)


def main() -> None:
    files = [p for p in ROOT.rglob("*") if p.is_file() and p.suffix.lower() in {".jpg", ".jpeg"} and p.stat().st_size > THRESHOLD_BYTES]
    print(f"Candidates: {len(files)}")
    before = sum(p.stat().st_size for p in files)
    print(f"Before bytes: {before}")
    converted = 0
    for file in files:
        try:
            convert_to_webp(file)
            converted += 1
            print(f"OK {file}")
        except Exception as exc:
            print(f"FAIL {file} -> {exc}")
    webp_files = [p for p in ROOT.rglob("*.webp") if p.is_file() and p.stat().st_size > 0]
    after = sum(p.stat().st_size for p in webp_files)
    print(f"Converted: {converted}")
    print(f"WebP total bytes: {after}")
    print(f"Estimated reduction vs originals: {round(((before - after) / before) * 100, 2)}%")


if __name__ == "__main__":
    main()
