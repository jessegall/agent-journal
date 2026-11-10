from dataclasses import dataclass

from engine.command.command import Command
from core.base.model.model import Model


@dataclass(frozen=True)
class MoveRow(Command[Model]):
    """Takes a move of a row by the move's name, for a module that moves a row it does not own."""

    model_name: str
    row_id: int
    move_name: str
