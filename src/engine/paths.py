from pathlib import Path

from resources.base import Refused

ENVIRONMENTS = "environments"
ROUTED = frozenset({"agent-controls", "agent-hooks", "hook", "journals", "plugins", "services", "update"})


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


def environments(root: Path) -> Path:
    return Path(root) / ENVIRONMENTS


def environment_home(root: Path, name: str) -> Path:
    return contained(environments(root), name)
