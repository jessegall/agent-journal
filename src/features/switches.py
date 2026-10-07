import os

from controllers.stored import CHANGES
from engine import bus
from engine.record import Record
from engine.settings_file import PROJECT_PARTS
from controllers.types import Environments, Features
from resources.base import SYSTEM

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


def warmed() -> None:
    for warm in WARMERS:
        warm()


def environments_changed(event=None, record=None) -> None:
    if record is None:
        return rebooted(event, record)
    names = tuple(sorted(row["title"] for row in Environments(record, actor=SYSTEM).rows.summaries() if not row["deleted"] and not row["completed"]))
    if ENVIRONMENT_NAMES.get(str(record.root)) != names:
        ENVIRONMENT_NAMES[str(record.root)] = names
        rebooted(event, record)


def generation() -> int:
    return GENERATION[0]
