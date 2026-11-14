from dataclasses import dataclass

from engine.command.command import Command
from core.modules.triggers.models.trigger import Trigger


@dataclass(frozen=True)
class PauseTrigger(Command[Trigger]):
    """Pauses a trigger without ending it, or lets it go on."""

    trigger_id: int
    is_paused: bool = True
