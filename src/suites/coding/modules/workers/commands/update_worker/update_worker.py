from dataclasses import dataclass

from engine.command.command import Command
from suites.coding.modules.workers.support.update_outcome import UpdateOutcome


@dataclass(frozen=True)
class UpdateWorker(Command[UpdateOutcome]):
    """A worker brings its own worktree up to the base branch it was cut from, keeping its uncommitted changes."""

    process_id: int | None = None
