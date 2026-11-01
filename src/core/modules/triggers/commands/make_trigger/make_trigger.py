from collections.abc import Sequence
from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.triggers.models.enums.trigger_action import TriggerAction
from core.modules.triggers.models.trigger import Trigger


@dataclass(frozen=True)
class MakeTrigger(Command[Trigger]):
    """Writes a trigger: the phrases that set it off, the text it gives and what it does."""

    phrases: Sequence[str]
    text: str
    action: TriggerAction
