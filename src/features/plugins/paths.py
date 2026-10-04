import re
import time
from pathlib import Path

from engine.wording import digest
from resources.base import Refused

HOME = "plugins"
DATA = "plugin-data"
LOGS = "plugins"


def home(root: Path) -> Path:
    return Path(root) / HOME


def folder(root: Path, name: str) -> Path:
    return home(root) / name


def data(root: Path, name: str) -> Path:
    return Path(root) / DATA / name


def plugin_socket(root: Path, name: str) -> Path:
    return Path("/tmp") / f"journal-{digest(str(data(root, name).resolve()), 12)}.sock"


def log(root: Path, name: str) -> Path:
    if not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9_.-]*", name) or name in (".", ".."):
        raise Refused("a plugin log name is a single file name")
    return Path(root) / "runtime" / LOGS / f"{name}.log"


def logged(root, name: str, line) -> None:
    where = log(root, name)
    where.parent.mkdir(parents=True, exist_ok=True)
    with where.open("a") as f:
        f.write(f"{time.strftime('%H:%M:%S')} {line}\n")


def queue_path(root: Path, name: str, env: str | None = None) -> Path:
    return Path(root) / "runtime" / "plugins" / (f"{name}.queue" if env is None else f"{name}.{env}.queue")


def busy_file(root: Path, name: str) -> Path:
    return Path(root) / "runtime" / f"installing-{name}.lock"
