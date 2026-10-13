from pathlib import Path

from controllers.types import environment_records
from controllers.types import Triggers
from resources.base import SYSTEM

RENAMED = {"message.unread": "message.unread.created", "message.unanswered": "message.unanswered.created", "work.unlogged": "work.open.logged",
           "work.awaiting": "work.awaiting.awaiting_since", "question.open": "question.open.created"}


def run(root: Path) -> list[str]:
    """Renames the five facts a trigger watched before each fact named the type, the state and the clock it is timed from; saving the row writes its sentence again."""
    records = list(environment_records(Path(root)))
    if not records:
        return []
    triggers = Triggers(records[0], actor=SYSTEM)
    moved = []
    for trigger in [triggers.load(found.n) for found in triggers.rows.summaries()]:
        if trigger.fact not in RENAMED:
            continue
        triggers.update(trigger.n, fact=RENAMED[trigger.fact])
        moved.append(f"trigger {trigger.n} watches {RENAMED[trigger.fact]}")
    return moved
