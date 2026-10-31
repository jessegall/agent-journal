from collections.abc import Sequence
from dataclasses import dataclass

from core.base.command.command import Command
from core.base.command.move_command import MoveCommand
from core.base.model.model import Model


@dataclass(frozen=True)
class OneMovePerRow:
    """The commands the rules of one hook returned, split into those that run and the second moves of a row already
    moved on this hook, which are dropped and named."""

    runnable: Sequence[tuple[str, Command[object]]]
    dropped: Sequence[str]

    @classmethod
    def split(cls, commands: Sequence[tuple[str, Command[object]]]) -> "OneMovePerRow":
        moved: set[tuple[type[Model], int]] = set()
        runnable: list[tuple[str, Command[object]]] = []
        dropped: list[str] = []
        for rule, command in commands:
            moved_row = cls.moved_row(command)
            if moved_row is not None and moved_row in moved:
                dropped.append(f"{rule} {type(command).__name__}")
                continue
            if moved_row is not None:
                moved.add(moved_row)
            runnable.append((rule, command))
        return cls(runnable, dropped)

    @staticmethod
    def moved_row(command: Command[object]) -> tuple[type[Model], int] | None:
        return command.moved_row() if isinstance(command, MoveCommand) else None
