import hashlib
import importlib
import json
import pkgutil
import sys
import time
from pathlib import Path

CODE = Path(__file__).resolve().parents[1]
ZIPPED = CODE.suffix == ".pyz"
DATA = CODE.with_name("src") if ZIPPED else CODE


SRC = "src"
ARCHIVE = "journal.pyz"
IGNORED_CODE_FOLDERS = {"__pycache__", "environments", "runtime", "tests"}


def code(root: Path) -> Path:
    return root / SRC


def build_file(root: Path) -> Path:
    return (Path(root) / ARCHIVE).resolve()


def code_stamp(place: Path) -> tuple[tuple[str, int], ...]:
    if place.is_file():
        return ((str(place.resolve()), place.stat().st_mtime_ns),)
    files = []
    for path in place.rglob("*.py"):
        relative = path.relative_to(place)
        if any(part.startswith(".") or part in IGNORED_CODE_FOLDERS for part in relative.parts[:-1]):
            continue
        try:
            files.append((str(path), path.stat().st_mtime_ns))
        except OSError:
            continue
    return tuple(sorted(files))


def installed_stamp(root: Path) -> tuple[tuple[str, int], ...]:
    return (*code_stamp(build_file(root)), *code_stamp(code(root)))


STAMP_FILE = "installed-stamp"
STAMP_FRESH = 5.0


def installed_digest(root: Path) -> str:
    """What the installed build and source tree look like now, as one short text: the whole tree is walked to find out."""
    return hashlib.sha1(repr(installed_stamp(root)).encode()).hexdigest()[:16]


def publish_stamp(root: Path) -> str:
    """Written by the one watcher of a journal, its server, so that nothing else has to walk the source tree to notice an upgrade."""
    from engine.stored import write_text
    digest = installed_digest(root)
    write_text(Path(root) / "runtime" / STAMP_FILE, json.dumps({"digest": digest, "at": time.time()}))
    return digest


def noticed_digest(root: Path) -> str:
    """The installed build as the watcher last wrote it, one small file to read; the tree is walked here only when the watcher has not written for a while, as when no server runs."""
    try:
        written = json.loads((Path(root) / "runtime" / STAMP_FILE).read_text())
        if time.time() - float(written["at"]) < STAMP_FRESH:
            return str(written["digest"])
    except (OSError, ValueError, KeyError, TypeError):
        pass
    return installed_digest(root)


def data(*parts: str) -> Path:
    return DATA.joinpath(*parts)


def entry(module: str) -> list[str]:
    return [sys.executable, str(CODE.with_name(ARCHIVE) if ZIPPED else CODE), "-m", module]


def own_build(root: Path) -> bool:
    built = Path(root) / ARCHIVE
    return not ZIPPED or not built.is_file() or built.resolve() == CODE


def entry_in(root: Path, module: str) -> list[str]:
    built = Path(root) / ARCHIVE
    return [sys.executable, str(built), "-m", module] if ZIPPED and built.is_file() else entry(module)


def point(root: Path, build: Path) -> None:
    pointer = Path(root) / f"{ARCHIVE}.link"
    pointer.unlink(missing_ok=True)
    pointer.symlink_to(build.name)
    pointer.replace(Path(root) / ARCHIVE)


def modules(package: str) -> list[tuple[str, bool]]:
    return sorted((found.name, found.ispkg) for found in pkgutil.iter_modules(importlib.import_module(package).__path__))
