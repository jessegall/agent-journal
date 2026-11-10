from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class RecordTaskRead(Command[None]):
    """Records that the agent has read a task in its current context."""

    task_id: int
