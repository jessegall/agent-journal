import re
from typing import ClassVar
from dataclasses import dataclass

from journal.models.model import Model
from journal.models.trigger_action import TriggerAction


@dataclass(frozen=True)
class Trigger(Model):
    """Words the user chose, and what the journal does when one comes up in a prompt or a tool call."""

    text_fields: ClassVar[tuple[str, ...]] = ("text",)
    words: tuple[str, ...] = ()
    action: TriggerAction = TriggerAction.NUDGE
    text: str = ""

    def met_by(self, text: str) -> bool:
        """The words as a phrase in the text, punctuation and case aside: update? meets update."""
        lowered = f" {' '.join(re.findall(r'[\w;/-]+', text.lower()))} "
        return any(f" {' '.join(re.findall(r'[\w;/-]+', word.lower()))} " in lowered for word in self.words)
