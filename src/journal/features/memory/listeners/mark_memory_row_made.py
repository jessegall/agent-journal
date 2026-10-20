from journal.events.listener import Listener
from journal.events.models.created import Created
from journal.features.memory.support.memory_cards import MemoryCards


class MarkMemoryRowMade(Listener[Created]):
    """A fact, a rule or a reminder recorded is a card in the chat, as version 3 showed it: its words, and the row it opens."""

    def __init__(self, marks: MemoryCards) -> None:
        self.marks = marks

    def handle(self, event: Created) -> None:
        self.marks.show(event.model, event.by, "recorded")
