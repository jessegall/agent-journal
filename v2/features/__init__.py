import importlib
from pathlib import Path

from v2.engine import bus

HERE = Path(__file__).parent
_loaded: set[str] = set()


def names() -> list[str]:
    return sorted(p.name for p in HERE.iterdir() if (p / "handlers.py").is_file())


def on(feature: str, pattern: str, handler) -> None:
    bus.on(pattern, handler, feature=feature)


def load() -> list[str]:
    for name in names():
        if name not in _loaded:
            importlib.import_module(f"v2.features.{name}.handlers").register()
            _loaded.add(name)
    return sorted(_loaded)


def unload() -> None:
    bus.clear()
    _loaded.clear()
