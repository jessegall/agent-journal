from pathlib import Path

FILE = Path(__file__).resolve().parents[1] / "VERSION"


def version() -> str:
    try:
        return FILE.read_text().strip()
    except OSError:
        return ""
