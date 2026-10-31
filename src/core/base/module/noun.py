from dataclasses import dataclass

from core.base.model.model import Model
from core.base.registry.dotted_path import DottedPath


@dataclass(frozen=True)
class Noun:
    """A model a module adds, with the class of its query when it has named filters of its own, and the dotted
    paths of its typed move commands when a move takes fields of its own, and the built subcommands it must
    not have."""

    model: type[Model]
    query: DottedPath | None = None
    commands: tuple[str, ...] = ()
    excluded_subcommands: tuple[str, ...] = ()
