from typing import Protocol

from engine.command.command import Command


class MoveCommandTypes(Protocol):
    """Finds the command class of one move of a model, by the model's command name and the move's name."""

    def move_command(self, cli_name: str, move_name: str) -> type[Command[object]]: ...
