import importlib
import importlib.util
from functools import cache
from pathlib import Path

from engine import bus
from engine.package import modules

FEATURES: dict[str, object] = {}
SWITCHED: list = []
RENAMED: set[str] = set()
SEATED: dict[str, int] = {}
CHANGE_SWITCHES = ("feature", "plugin")


@cache
def names() -> list[str]:
    return [name for name, package in modules("features") if package and importlib.util.find_spec(f"features.{name}.feature")]


def load(root: Path | None = None) -> list[str]:
    discover()
    if root:
        rename_aliases(root)
    wire()
    subscribe()
    if root:
        sync_rows(root)
    return sorted(FEATURES)


def discover() -> None:
    for name in names():
        importlib.import_module(f"features.{name}.feature")


def rename_aliases(root: Path) -> None:
    from features.base import REGISTRY
    from features.renames import rename
    if str(root) in RENAMED:
        return
    RENAMED.add(str(root))
    for cls in REGISTRY.values():
        for old, now in cls.renamed_from().items():
            rename(root, old, now)


def wire() -> None:
    from features.base import REGISTRY
    for name, cls in REGISTRY.items():
        if name in FEATURES:
            continue
        FEATURES[name] = cls()
        FEATURES[name].wire()


def subscribe() -> None:
    from features.switches import environments_changed, rebooted
    if not SWITCHED:
        SWITCHED.extend([*(bus.on(kind, rebooted) for kind in CHANGE_SWITCHES), bus.on("environment", environments_changed)])


def sync_rows(root: Path) -> None:
    from features.switches import generation
    if SEATED.get(str(root)) != generation():
        seat(root)
        SEATED[str(root)] = generation()


def running(feature: type):
    return FEATURES.get(feature.name)


def seat(root: Path) -> None:
    from controllers.types import Features
    from engine.paths import environments
    from engine.record import Record
    from features.switches import booted
    from resources.base import SYSTEM
    for home in sorted(p for p in environments(root).glob("*") if p.is_dir()):
        record = Record(root, home.name)
        rows = Features(record, actor=SYSTEM)
        known = {r.title: r for r in rows._every()}
        for name, feature in FEATURES.items():
            if name not in known:
                rows.create(name, enabled=feature.default_for(root))
        for name, row in known.items():
            if name not in FEATURES and not row.missing:
                rows.update(row.n, missing=True)
            elif name in FEATURES and row.missing:
                rows.update(row.n, missing=False)
        booted(record)


def unload() -> None:
    from controllers.base import COMMANDS, HANDLERS
    from features.switches import rebooted
    from engine.extension import clear_all
    COMMANDS.clear()
    HANDLERS.clear()
    bus.clear()
    clear_all()
    FEATURES.clear()
    SWITCHED.clear()
    SEATED.clear()
    rebooted()


def describe() -> dict:
    return {name: f.describe() for name, f in FEATURES.items()}


def passed(event, record) -> None:
    from features.switches import rebooted
    if event.data.get("setting"):
        record.reread_settings()
    elif event.type in CHANGE_SWITCHES:
        rebooted(event, record)
