from journal.events.listener import Listener
from journal.events.models.deleted import Deleted
from journal.features.memory.support.memory_cards import MemoryCards


class MemoryStrikeCard(Listener[Deleted]):
    """A fact, a rule or a reminder struck is a card in the chat, so the user sees what no longer holds."""

    def __init__(self, thresholds: MemoryCards) -> None:
        self.marks = thresholds

    def handle(self, event: Deleted) -> None:
        self.marks.show(event.model, event.actor, "struck")
