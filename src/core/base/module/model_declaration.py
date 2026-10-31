from collections.abc import Sequence
from dataclasses import dataclass

from core.base.command.move_command import MoveCommand
from core.base.model.model import Model
from core.base.query.query import Query


@dataclass(frozen=True)
class ModelDeclaration:
    """A model a module adds, with the class of its query when it has named filters of its own, its typed move
    commands when a move takes fields of its own, and the built subcommands it must not have."""

    model: type[Model]
    query: type[Query[Model]] | None = None
    commands: Sequence[type[MoveCommand[Model]]] = ()
    excluded_subcommands: Sequence[str] = ()
