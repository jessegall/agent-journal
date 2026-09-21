import importlib
from pathlib import Path

from engine import bus

HERE = Path(__file__).parent
FEATURES: dict[str, object] = {}
SWITCHED: list = []
CHANGE_SWITCHES = ("feature", "plugin")


def names() -> list[str]:
    return sorted(p.name for p in HERE.iterdir() if (p / "feature.py").is_file())


def load(root: Path | None = None) -> list[str]:
    from features.base import REGISTRY
    from features.renames import rename
    for name in names():
        importlib.import_module(f"features.{name}.feature")
    if root:
        for name, cls in REGISTRY.items():
            for alias in cls.aliases:
                old, key = alias if isinstance(alias, tuple) else (alias, "")
                rename(root, old, f"{name}.{key}" if key else name)
    from features.base import rebooted
    for name, cls in REGISTRY.items():
        if name not in FEATURES:
            FEATURES[name] = cls()
            FEATURES[name].register()
    if not SWITCHED:
        SWITCHED.extend(bus.on(kind, rebooted) for kind in CHANGE_SWITCHES)
    if root:
        seat(root)
    return sorted(FEATURES)


def seat(root: Path) -> None:
    from controllers.types import Features
    from engine.record import Record
    from features.base import booted
    from resources.base import SYSTEM
    for home in sorted(p for p in (Path(root) / "environments").glob("*") if p.is_dir()):
        record = Record(root, home.name)
        rows = Features(record, actor=SYSTEM)
        known = {r.title: r for r in rows._every()}
        for name, feature in FEATURES.items():
            if name not in known:
                rows.create(name, enabled=feature.default_for(root))
        for name, row in known.items():
            if name not in FEATURES and not row.missing:
                rows.update(row.n, enabled=False, missing=True)
            elif name in FEATURES and row.missing:
                rows.update(row.n, missing=False)
        booted(record)


def unload() -> None:
    from controllers.base import COMMANDS, HANDLERS
    from features.base import rebooted
    from engine.hooks import POLICIES
    from features.format import FORMATTERS
    COMMANDS.clear()
    HANDLERS.clear()
    FORMATTERS.clear()
    bus.clear()
    POLICIES.clear()
    FEATURES.clear()
    SWITCHED.clear()
    rebooted()


def describe() -> dict:
    return {name: f.describe() for name, f in FEATURES.items()}


def passed(event, record) -> None:
    from features.base import rebooted
    if event.type in CHANGE_SWITCHES:
        rebooted(event, record)
