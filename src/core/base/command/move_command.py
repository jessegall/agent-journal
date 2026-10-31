from dataclasses import dataclass
from typing import ClassVar, TypeVar

from core.base.command.command import Command
from core.base.model.model import Model
from core.base.model.move import Move

M = TypeVar("M", bound=Model, covariant=True)
ROW_ID = "row_id"


@dataclass(frozen=True)
class MoveCommand(Command[M]):
    """A command that moves a row from one state to the next."""

    move: ClassVar[Move]
    row_id: int

    def move_fields(self) -> dict[str, object]:
        return self.field_values([ROW_ID])
