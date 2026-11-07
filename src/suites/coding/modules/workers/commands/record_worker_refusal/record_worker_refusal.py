from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class RecordWorkerRefusal(Command[None]):
    worktree_id: int
