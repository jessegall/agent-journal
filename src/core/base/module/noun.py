from dataclasses import dataclass

from core.base.model.model import Model
from core.base.module.dotted_path import DottedPath


@dataclass(frozen=True)
class Noun:
    """A model a module adds, with the class of its query when it has named filters of its own."""

    model: type[Model]
    query: DottedPath | None = None
