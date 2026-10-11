from pathlib import Path

from controllers.types import environment_records
from engine.record import Record

SPLIT = {"work_tracking.carry on": ("work_tracking.nothing ready",),
         "tickets.decisions": ("tickets.waits", "tickets.drafts")}


def run(root: Path) -> str:
    """Gives each switch made out of a shared one the choice and the cadence its old key carried, so an agent's nudge a user silenced stays silent after the split."""
    carried = 0
    for record in environment_records(Path(root)):
        carried += kept(record)
    return f"a split switch kept what its old one was set to in {carried} environments"


def kept(record: Record) -> int:
    chosen, paced = record.features, record.triggers
    taken = {new: chosen[old] for old, news in SPLIT.items() if old in chosen for new in news}
    timed = {new: paced[old] for old, news in SPLIT.items() if old in paced for new in news}
    if taken:
        record.change_setting("features", taken)
    if timed:
        record.change_setting("triggers", timed)
    return 1 if taken or timed else 0
