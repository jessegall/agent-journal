from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class ClearWorkerRefusals(Command[None]):
    worktree_id: int
