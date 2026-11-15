from collections.abc import Sequence
from dataclasses import dataclass

from engine.command.move_command import MoveCommand
from engine.model.model import Model
from engine.query.query import Query
from engine.types.class_fields import class_fields

ALL_SUBCOMMANDS = ["make", "edit", "show", "list", "delete"]
BUILT = ["make", "edit", "delete"]


@dataclass(frozen=True)
class ModelDeclaration:
    """A model a module adds, with the class of its query when it has named filters of its own, its typed move
    commands when a move takes fields of its own, and the built subcommands it must not have."""

    model: type[Model]
    query: type[Query[Model]] | None = None
    commands: Sequence[type[MoveCommand[Model]]] = ()
    excluded_subcommands: Sequence[str] = ()
    # the journal's own bookkeeping, which a command that writes it does not list among the rows it changed
    is_bookkeeping: bool = False

    # a model declared with keywords is written as a class in its own file that sets the fields as class attributes
    @classmethod
    def declared(cls) -> "ModelDeclaration":
        return ModelDeclaration(**class_fields(cls, ModelDeclaration))
