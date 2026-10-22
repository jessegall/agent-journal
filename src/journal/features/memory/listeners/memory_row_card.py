from journal.events.listener import Listener
from journal.events.models.created import Created
from journal.features.memory.support.memory_cards import MemoryCards


class MemoryRowCard(Listener[Created]):
    """A fact, a rule or a reminder recorded is a card in the chat, as version 3 showed it: its number with a check mark, and the row it opens."""

    def __init__(self, thresholds: MemoryCards) -> None:
        self.marks = thresholds

    def handle(self, event: Created) -> None:
        self.marks.show(event.model, event.actor, "recorded", "check", "good")
