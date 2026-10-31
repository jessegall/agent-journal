from dataclasses import dataclass
from typing import TypeVar

from core.base.command.command import Command
from core.base.model.model import Model

M = TypeVar("M", bound=Model)


@dataclass(frozen=True)
class MakeCommand(Command[M]):
    """A command that makes a new row."""

    def model_fields(self) -> dict[str, object]:
        return self.field_values(())
