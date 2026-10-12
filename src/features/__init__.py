import hashlib
import importlib
import importlib.util
from functools import cache
from pathlib import Path

from engine import bus
from engine.package import modules
from engine.stored import write_text
from framework.loaded import FEATURES, SEATED, SWITCHED, running  # noqa: F401 - the loader fills them; the rest of the journal reads them from there

CHANGE_SWITCHES = ("feature", "plugin")
SEATED_STAMP = "features-seated"


@cache
def names() -> list[str]:
    return [name for name, package in modules("features") if package and importlib.util.find_spec(f"features.{name}.feature")]


COMMANDS_ONLY: list[bool] = []
"""Set once by a process that only runs commands: it wires the commands and the refusers and no listener or handler, since the server relays what it writes."""


def load(root: Path | None = None, commands_only: bool = False) -> list[str]:
    """Wires the features. A full load asked for after a commands-only one unloads first: wire() skips every feature already loaded, so without that the second load would wire nothing at all and the process would run with no handler and no listener."""
    if commands_only:
        COMMANDS_ONLY[:] = [True]
    elif COMMANDS_ONLY:
        unload()
    discover()
    if root:
        rename_aliases(root)
    dispatch_on_a_lane()
    wire()
    subscribe()
    if root:
        sync_rows(root)
    return sorted(FEATURES)


def discover() -> None:
    for name in names():
        importlib.import_module(f"features.{name}.feature")


def rename_aliases(root: Path) -> None:
    from framework.base import REGISTRY
    from framework.renames import sweep
    sweep(root, {was: now for cls in REGISTRY.values() for was, now in cls.renamed_from().items()})


def wire() -> None:
    from framework.base import REGISTRY
    from framework.promises import PROMISED
    for name, cls in REGISTRY.items():
        if name in FEATURES:
            continue
        FEATURES[name] = cls()
        FEATURES[name].wire(bool(COMMANDS_ONLY))
        PROMISED.refuse_owing(name)


def dispatch_on_a_lane() -> None:
    """From here a told event is a tick on a lane, running the same receivers inside a transaction. Before the wiring, so every listener the bus takes from here on joins the lane with it; a process wired for its commands alone keeps the walk, since it has no receivers at all."""
    if COMMANDS_ONLY:
        return
    from framework.adapter import dispatched_on_a_lane
    dispatched_on_a_lane()


def subscribe() -> None:
    from framework.switches import environments_changed, switch_changed
    if not SWITCHED and not COMMANDS_ONLY:
        SWITCHED.extend([*(bus.on(kind, switch_changed) for kind in CHANGE_SWITCHES), bus.on("environment", environments_changed), bus.on("environment", seat_created_home)])


def sync_rows(root: Path) -> None:
    from engine.paths import environment_names
    from engine.record import Record
    from framework.switches import generation, seen_environments
    if SEATED.get(str(root)) == generation():
        return
    homes = environment_names(root)
    if homes:
        seen_environments(Record(root, homes[0]))
    held, wanted = seated_now(root), seating(homes)
    if held != wanted:
        new = unseated(held, wanted)
        if new:
            seat(root, new)
        stamp_seated(root, wanted)
    SEATED[str(root)] = generation()


def seating(homes: tuple[str, ...] | list[str]) -> list[str]:
    """The seated stamp: this build's features and every environment, in the one order both writers of the stamp use."""
    return [features_stamp(), *homes]


def seated_now(root: Path) -> list[str]:
    kept = Path(root) / SEATED_STAMP
    return kept.read_text().splitlines() if kept.is_file() else []


def stamp_seated(root: Path, lines: list[str]) -> None:
    write_text(Path(root) / SEATED_STAMP, "\n".join(lines))


def seat_created_home(event, record) -> None:
    """Seats an environment as soon as it is made, after the answer that made it, so the next command finds its feature rows there instead of paying for a hundred of them inside a read or inside the making; until then its switches read as their defaults."""
    from controllers.types import Environments
    from resources.base import SYSTEM
    if event.action != "created" or record is None:
        return
    home = Environments(record, actor=SYSTEM).rows.peek(event.n).title
    bus.background(f"seat {record.root}/{home}", lambda: seated_home(record.root, home))


def seated_home(root: Path, home: str) -> None:
    from engine.paths import environment_names
    from framework.switches import HOME_WARMERS
    held = seated_now(root)
    if not held or home in held[1:]:
        return
    seat(root, (home,))
    stamp_seated(root, seating(environment_names(root)))
    for warm in HOME_WARMERS:
        warm(root, home)


def features_stamp() -> str:
    return hashlib.sha256("\n".join(sorted(FEATURES)).encode()).hexdigest()


def unseated(held: list[str], seating: list[str]) -> tuple[str, ...]:
    if held[:1] != seating[:1]:
        return tuple(seating[1:])
    seated = set(held[1:])
    return tuple(home for home in seating[1:] if home not in seated)


def seat(root: Path, homes: tuple[str, ...]) -> None:
    from controllers.types import Features
    from engine.record import Record
    from framework.switches import booted
    from resources.base import PROJECT, SYSTEM
    for home in homes:
        record = Record(root, home)
        rows = Features(record, actor=SYSTEM)
        known = {r.title: r for r in rows.rows.every()}
        with bus.settled():
            for name, feature in FEATURES.items():
                if name not in known and feature.scope != PROJECT and not rows.rows.n_of_title(name):
                    rows.create(name, enabled=feature.default_for(root))
            for name, row in known.items():
                if name not in FEATURES and not row.missing:
                    rows.update(row.n, missing=True)
                elif name in FEATURES and row.missing:
                    rows.update(row.n, missing=False)
        booted(record)


def unload() -> None:
    from controllers.base import COMMANDS, HANDLERS
    from framework.switches import rebooted
    from declaring.extension import clear_all
    from resources.memo import forget_all
    COMMANDS.clear()
    HANDLERS.clear()
    bus.clear()
    clear_all()
    forget_all()
    FEATURES.clear()
    COMMANDS_ONLY.clear()
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
    from framework.switches import rebooted
    setting = event.data.get("setting")
    if setting:
        record.reread_settings()
    if event.type in CHANGE_SWITCHES and setting in (None, Record.features):
        rebooted(event, record)
