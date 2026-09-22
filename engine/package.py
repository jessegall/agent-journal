import importlib
import pkgutil
import sys
from pathlib import Path

CODE = Path(__file__).resolve().parents[1]
ZIPPED = CODE.suffix == ".pyz"
DATA = CODE.with_name("src") if ZIPPED else CODE


def data(*parts: str) -> Path:
    return DATA.joinpath(*parts)


def entry(module: str) -> list[str]:
    if ZIPPED:
        return [sys.executable, str(CODE.with_name("journal.pyz")), "-m", module]
    return [sys.executable, str(CODE.joinpath(*module.split("."))) + ".py"]


def point(root: Path, build: Path) -> None:
    pointer = Path(root) / "journal.pyz.link"
    pointer.unlink(missing_ok=True)
    pointer.symlink_to(build.name)
    pointer.replace(Path(root) / "journal.pyz")


def modules(package: str) -> list[tuple[str, bool]]:
    return sorted((found.name, found.ispkg) for found in pkgutil.iter_modules(importlib.import_module(package).__path__))
