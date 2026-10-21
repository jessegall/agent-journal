from dataclasses import dataclass

from journal.support.card_kind import CardKind


@dataclass(frozen=True)
class MemoryRow:
    """A fact, rule or reminder as the feature data carries it: its noun, number, words, keywords, the chat's switch for it and its presence in the agent's context window."""

    noun: str
    id: int
    text: str
    keywords: tuple[str, ...]
    mark: CardKind
    presence: bool = False

    def line(self) -> str:
        from journal.features.memory.feature import Memory
        return Memory.MEMORY_READ_REQUEST.create(noun=self.noun, n=self.id).rendered()
