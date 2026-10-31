from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.triggers.models.trigger import Trigger


@dataclass(frozen=True)
class StrikeTrigger(Command[Trigger]):
    """Ends a trigger: it gives its text no more."""

    trigger_id: int
