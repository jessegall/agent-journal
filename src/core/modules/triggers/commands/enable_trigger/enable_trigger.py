from dataclasses import dataclass

from engine.command.command import Command
from core.modules.triggers.models.trigger import Trigger


@dataclass(frozen=True)
class EnableTrigger(Command[Trigger]):
    """Lets a trigger an agent made start to act."""

    lock = True

    trigger_id: int
