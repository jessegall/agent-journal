import importlib
import pkgutil
import sys
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


def data(*parts: str) -> Path:
    return DATA.joinpath(*parts)


def entry(module: str) -> list[str]:
    if ZIPPED:
        return [sys.executable, str(CODE.with_name(ARCHIVE)), "-m", module]
    return [sys.executable, str(CODE.joinpath(*module.split("."))) + ".py"]


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
