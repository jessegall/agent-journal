from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class JudgeTask(Command[None]):
    """Judges one task that was made, changed or tagged against the rules of its environment, when a rule there is
    turned on."""

    task_id: int
