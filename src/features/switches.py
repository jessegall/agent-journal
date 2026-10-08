import os

from controllers.stored import CHANGES
from engine import bus
from engine.record import Record
from engine.settings_file import PROJECT_PARTS
from controllers.types import Environments, Features
from engine.paths import environment_home
from resources.base import CREATED, RAISED, SYSTEM

SWITCHES: dict[str, tuple[int, dict[str, bool]]] = {}
GENERATION = [0]
CHANGE_LOGS: dict[str, str] = {}
UNEVENTED = [False]
ENVIRONMENT_NAMES: dict[str, tuple] = {}
WARMERS: list = []


def watch_change_log() -> None:
    UNEVENTED[0] = True


def written(record) -> int:
    home = str(record.home)
    if home not in CHANGE_LOGS:
        CHANGE_LOGS[home] = str(Features(record, actor=SYSTEM).rows.folder() / CHANGES)
    try:
        return os.stat(CHANGE_LOGS[home]).st_size
    except OSError:
        return 0


def booted(record) -> dict[str, bool]:
    rows = Features(record, actor=SYSTEM)
    kept = PROJECT_PARTS.of(Record.features)
    SWITCHES[str(record.home)] = (written(record) if UNEVENTED[0] else 0, {row.title: bool(row.enabled) for row in rows.rows.viewed() if row.title not in kept})
    return SWITCHES[str(record.home)][1]


def switches(record) -> dict[str, bool]:
    held = SWITCHES.get(str(record.home))
    if held is None or (UNEVENTED[0] and held[0] != written(record)):
        return booted(record)
    return held[1]


def rebooted(event=None, record=None) -> None:
    GENERATION[0] += 1
    if record is None:
        SWITCHES.clear()
    else:
        booted(record)
    bus.defer_once("warm what a change cleared", warmed)


def switch_changed(event, record) -> None:
    if event.action == RAISED:
        return
    if event.type == Features.resource.type and event.action == CREATED:
        booted(record)
        return
    rebooted(event, record)


def warmed() -> None:
    for warm in WARMERS:
        warm()


def environments_changed(event=None, record=None) -> None:
    if record is None:
        return rebooted(event, record)
    root = str(record.root)
    names = standing_environments(record)
    changed = set(ENVIRONMENT_NAMES.get(root, names)) ^ set(names)
    ENVIRONMENT_NAMES[root] = names
    if changed:
        environments_moved(record, changed)


def environments_moved(record, changed: set[str]) -> None:
    import features
    from features.format import forget_mentions
    for name in changed:
        SWITCHES.pop(str(environment_home(record.root, name)), None)
    features.SEATED.pop(str(record.root), None)
    forget_mentions(changed)


def standing_environments(record) -> tuple[str, ...]:
    return tuple(sorted(row["title"] for row in Environments(record, actor=SYSTEM).rows.standing_summaries()))


def seen_environments(record) -> None:
    ENVIRONMENT_NAMES[str(record.root)] = standing_environments(record)


def generation() -> int:
    return GENERATION[0]
