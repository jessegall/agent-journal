from dataclasses import dataclass
from typing import TypeVar

from core.base.command.command import Command
from core.base.command.move_command import ROW_ID
from core.base.model.model import Model

M = TypeVar("M", bound=Model, covariant=True)


@dataclass(frozen=True)
class EditCommand(Command[M]):
    """A command that changes some fields of a row; a field left as None is not changed."""

    row_id: int

    def changed_fields(self) -> dict[str, object]:
        return {name: value for name, value in self.field_values([ROW_ID]).items() if value is not None}
