from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class RecordWorkerRefusal(Command[None]):
    worktree_id: int
    refusal_text: str
