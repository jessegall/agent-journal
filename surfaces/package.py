import io
import json
import zipfile
from engine.package import data


HERE = data("extension")


def info() -> dict:
    try:
        store = json.loads((HERE / "store.json").read_text()).get("url", "")
    except (OSError, ValueError):
        store = ""
    return {"available": (HERE / "manifest.json").is_file(), "store": store}


def archive() -> bytes:
    if not info()["available"]:
        return b""
    out = io.BytesIO()
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as zipped:
        for path in sorted(HERE.rglob("*")):
            if path.is_file() and "__pycache__" not in path.parts:
                zipped.write(path, path.relative_to(HERE))
    return out.getvalue()
