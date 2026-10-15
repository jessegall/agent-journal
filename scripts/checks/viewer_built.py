import hashlib
import sys
from pathlib import Path

WEB = Path(__file__).resolve().parents[2] / "src" / "web"
SOURCES = ("src", "public", "index.html", "phone.html", "share.html", "package-lock.json", "vite.config.js")
BUILT_FROM = WEB / "dist" / "built-from"


def digest() -> str:
    """One hash over every file the viewer is built from, by path and content, so the bundle can say which sources it was built from."""
    hashed = hashlib.sha256()
    for name in SOURCES:
        top = WEB / name
        for path in sorted([top] if top.is_file() else (one for one in top.rglob("*") if one.is_file())):
            hashed.update(str(path.relative_to(WEB)).encode() + b"\0" + path.read_bytes() + b"\0")
    return hashed.hexdigest()


def problems() -> list[str]:
    built = BUILT_FROM.read_text().strip() if BUILT_FROM.is_file() else ""
    if built == digest():
        return []
    return ["src/web/dist was not built from the viewer's sources as they are now: the build was forgotten or failed. "
            "Run npm --prefix src/web run build (after npm --prefix src/web install) and commit src/web/dist."]


if __name__ == "__main__":
    if sys.argv[1:] == ["--digest"]:
        print(digest())
        sys.exit(0)
    text = problems()
    print("\n".join(text) if text else "the viewer's bundle was built from its sources as they are")
    sys.exit(1 if text else 0)
