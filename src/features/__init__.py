import hashlib
import importlib
import importlib.util
from functools import cache
from pathlib import Path

from engine import bus
from engine.package import modules
from engine.stored import write_text

FEATURES: dict[str, object] = {}
SWITCHED: list = []
SEATED: dict[str, int] = {}
CHANGE_SWITCHES = ("feature", "plugin")
SEATED_STAMP = "features-seated"


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
    from features.renames import sweep
    sweep(root, {was: now for cls in REGISTRY.values() for was, now in cls.renamed_from().items()})


def wire() -> None:
    from features.base import REGISTRY
    for name, cls in REGISTRY.items():
        if name in FEATURES:
            continue
        FEATURES[name] = cls()
        FEATURES[name].wire()


def subscribe() -> None:
    from features.switches import environments_changed, switch_changed
    if not SWITCHED:
        SWITCHED.extend([*(bus.on(kind, switch_changed) for kind in CHANGE_SWITCHES), bus.on("environment", environments_changed)])


def sync_rows(root: Path) -> None:
    from engine.paths import environment_names
    from engine.record import Record
    from features.switches import generation, seen_environments
    if SEATED.get(str(root)) == generation():
        return
    homes = environment_names(root)
    if homes:
        seen_environments(Record(root, homes[0]))
    kept = Path(root) / SEATED_STAMP
    held = kept.read_text().splitlines() if kept.is_file() else []
    seating = [features_stamp(), *homes]
    if held != seating:
        seat(root, unseated(held, seating))
        write_text(kept, "\n".join(seating))
    SEATED[str(root)] = generation()


def features_stamp() -> str:
    return hashlib.sha256("\n".join(sorted(FEATURES)).encode()).hexdigest()


def unseated(held: list[str], seating: list[str]) -> tuple[str, ...]:
    if held[:1] != seating[:1]:
        return tuple(seating[1:])
    seated = set(held[1:])
    return tuple(home for home in seating[1:] if home not in seated)


def running(feature: type):
    return FEATURES.get(feature.name)


def seat(root: Path, homes: tuple[str, ...]) -> None:
    from controllers.types import Features
    from engine.record import Record
    from features.switches import booted
    from resources.base import PROJECT, SYSTEM
    for home in homes:
        record = Record(root, home)
        rows = Features(record, actor=SYSTEM)
        known = {r.title: r for r in rows.rows.every()}
        with bus.settled():
            for name, feature in FEATURES.items():
                if name not in known and feature.scope != PROJECT:
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
    from engine.memo import forget_all
    COMMANDS.clear()
    HANDLERS.clear()
    bus.clear()
    clear_all()
    forget_all()
    FEATURES.clear()
    SWITCHED.clear()
    SEATED.clear()
    rebooted()


def settings_changed(record, names, actor: str) -> None:
    """Tells each feature named that its settings changed: the one funnel the settings write and journal feature configure both use."""
    for name in names:
        if name in FEATURES:
            FEATURES[name].settings_changed(record, actor)


def switched(record, before: dict, after: dict, actor: str) -> None:
    """Tells each feature whose switch moved which way it went."""
    for name, on in after.items():
        if name in FEATURES and before.get(name) != on:
            FEATURES[name].switched(record, actor, bool(on))


def describe() -> dict:
    return {name: f.describe() for name, f in FEATURES.items()}


def passed(event, record) -> None:
    from engine.record import Record
    from features.switches import rebooted
    setting = event.data.get("setting")
    if setting:
        record.reread_settings()
    if event.type in CHANGE_SWITCHES and setting in (None, Record.features):
        rebooted(event, record)
