from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.triggers.models.trigger import Trigger


@dataclass(frozen=True)
class FireTrigger(Command[Trigger]):
    """Notes that a scheduled trigger gave its text, and sets its next time or ends it."""

    trigger_id: int
