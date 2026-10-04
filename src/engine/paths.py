from pathlib import Path

from resources.base import Refused


def contained(folder: Path, name: str, nested: bool = False) -> Path:
    if not isinstance(name, str) or not name or "\\" in name or "\x00" in name:
        raise Refused(f"invalid path {name!r}")
    part = Path(name)
    if part.is_absolute() or any(piece in ("", ".", "..") for piece in name.split("/")) or (not nested and len(part.parts) != 1):
        raise Refused(f"invalid path {name!r}")
    target = folder / part
    if not target.resolve().is_relative_to(folder.resolve()):
        raise Refused(f"path {name!r} leaves its folder")
    return target


def environment_path(folder: Path, name: str) -> Path:
    if isinstance(name, str) and "." in name:
        raise Refused(f"environment name {name!r} cannot contain a dot")
    return contained(folder, name)
