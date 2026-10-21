from dataclasses import dataclass

from journal.support.chat_mark import ChatMark


@dataclass(frozen=True)
class MemoryRow:
    """A fact, rule or reminder as the readings carries it: its noun, number, words, keywords, the chat's switch for it and its presence in the agent's context window."""

    noun: str
    id: int
    text: str
    keywords: tuple[str, ...]
    mark: ChatMark
    presence: bool = False

    def line(self) -> str:
        from journal.features.memory.feature import Memory
        return Memory.MEMORY_WHISPERED_BACK.create(noun=self.noun, n=self.id).rendered()
