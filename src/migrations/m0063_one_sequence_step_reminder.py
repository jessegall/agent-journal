from pathlib import Path

from controllers.types import environment_records
from features.trigger import MINUTES

FEATURE = "sequences"
OLD = "nudge_every"
CADENCE = "sequences.unfinished"
DEFAULT = 1


def run(root: Path) -> list[str]:
    moved = []
    for record in environment_records(Path(root)):
        kept = record.setting(FEATURE, {})
        if OLD not in kept:
            continue
        every = kept[OLD]
        cadences = record.setting("triggers", {})
        if str(every).strip().isdigit() and int(every) != DEFAULT and CADENCE not in cadences:
            record.set_setting("triggers", {**cadences, CADENCE: {"unit": MINUTES, "every": int(every)}})
        record.set_setting(FEATURE, {key: value for key, value in kept.items() if key != OLD})
        moved.append(f"{record.env}: one sequence step reminder, every {every} minutes")
    return moved
