from dataclasses import dataclass

from engine.command.command import Command
from core.modules.pins.models.pin import Pin


@dataclass(frozen=True)
class MakePin(Command[Pin]):
    """Pins a link above the chat of the caller's environment."""

    lock = False

    title: str
    link: str
    button_label: str
