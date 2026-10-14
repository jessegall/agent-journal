from dataclasses import dataclass

from journal.models.model import Model
from journal.models.trigger_action import TriggerAction


@dataclass(frozen=True)
class Trigger(Model):
    """Words the user chose, and what the journal does when one comes up in a prompt or a tool call."""

    words: tuple[str, ...] = ()
    action: TriggerAction = TriggerAction.NUDGE
    text: str = ""

    def met_by(self, text: str) -> bool:
        lowered = f" {text.lower()} "
        return any(f" {word.lower()} " in lowered or word.lower() in lowered.split() for word in self.words)
