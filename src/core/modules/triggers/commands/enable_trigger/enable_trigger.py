from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.triggers.models.trigger import Trigger


@dataclass(frozen=True)
class EnableTrigger(Command[Trigger]):
    """Lets a trigger an agent made start to act."""

    trigger_id: int
