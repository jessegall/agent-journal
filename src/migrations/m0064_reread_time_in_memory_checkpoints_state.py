from pathlib import Path

from controllers.types import environment_records
from features.memory_checkpoints.reread import READ_AT, STATE


def run(root: Path) -> list[str]:
    moved = []
    for record in environment_records(Path(root)):
        read_at = record.setting(READ_AT)
        if read_at and not record.state(STATE).get(READ_AT):
            record.state(STATE).set(READ_AT, read_at)
            moved.append(f"{record.env}: the last reread of rules and facts moved into memory_checkpoints' state")
    return moved
