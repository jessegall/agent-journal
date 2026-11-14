from typing import Protocol

from engine.command.command import Command


class BuiltCommandTypes(Protocol):
    """Finds a command class the core builds for a model when a command line is read: one of its moves, by the
    model's command name and the move's name, or its edit, by the model's command name."""

    def move_command(self, cli_name: str, move_name: str) -> type[Command[object]]: ...

    def edit_command(self, cli_name: str) -> type[Command[object]]: ...
