import importlib
from pathlib import Path

from engine import bus

HERE = Path(__file__).parent
FEATURES: dict[str, object] = {}


def names() -> list[str]:
    return sorted(p.name for p in HERE.iterdir() if (p / "feature.py").is_file())


def load(root: Path | None = None) -> list[str]:
    from features.base import REGISTRY
    from features.renames import rename
    for name in names():
        importlib.import_module(f"features.{name}.feature")
    if root:
        for name, cls in REGISTRY.items():
            for was in cls.was:
                rename(root, was, name)
    for name, cls in REGISTRY.items():
        if name not in FEATURES:
            FEATURES[name] = cls()
            FEATURES[name].register()
    return sorted(FEATURES)


def unload() -> None:
    from controllers.base import COMMANDS
    from engine.hooks import POLICIES
    from features.format import FORMATTERS
    COMMANDS.clear()
    FORMATTERS.clear()
    bus.clear()
    POLICIES.clear()
    FEATURES.clear()


def describe() -> dict:
    return {name: f.describe() for name, f in FEATURES.items()}
