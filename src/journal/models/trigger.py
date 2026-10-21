import re
from typing import ClassVar
from dataclasses import dataclass

from journal.models.model import Model
from journal.models.trigger_action import TriggerAction


@dataclass(frozen=True)
class Trigger(Model):
    """Words the user chose, and what the journal does when one comes up in a prompt or a tool call."""

    text_fields: ClassVar[tuple[str, ...]] = ("phrases",)
    phrases: tuple[str, ...] = ()
    action: TriggerAction = TriggerAction.NUDGE
    text: str = ""

    def matches(self, text: str) -> bool:
        lowered = f" {' '.join(re.findall(r'[\w;/-]+', text.lower()))} "
        return any(f" {' '.join(re.findall(r'[\w;/-]+', word.lower()))} " in lowered for word in self.phrases)

    def summary_line(self) -> str:
        return self.first_line(self.text)
