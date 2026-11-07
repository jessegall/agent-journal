from dataclasses import dataclass
from typing import ClassVar

from core.base.command.command import Command
from core.base.model.model import Model


@dataclass(frozen=True)
class DeleteCommand(Command[None]):
    """A command that deletes a row."""

    deleted_model: ClassVar[type[Model]]
    row_id: int

    @classmethod
    def model(cls) -> type[Model]:
        return cls.deleted_model
