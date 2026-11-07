from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.pins.models.pin import Pin


@dataclass(frozen=True)
class ClosePin(Command[Pin]):
    """Takes a pin off the chat."""

    pin_id: int
