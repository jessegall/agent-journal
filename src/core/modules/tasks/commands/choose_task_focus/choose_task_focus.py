from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class ChooseTaskFocus(Command[tuple[str, ...]]):
    """Names the started task the asking agent works on now, clears that choice, or only reads it."""

    task_id: int | None = None
    clears: bool = False
