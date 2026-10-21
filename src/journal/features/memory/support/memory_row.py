from dataclasses import dataclass

from journal.support.chat_mark import ChatMark


@dataclass(frozen=True)
class MemoryRow:
    """A fact, rule or reminder as the readings carries it: its noun, number, words, keywords and the chat's switch for it."""

    noun: str
    id: int
    text: str
    keywords: tuple[str, ...]
    mark: ChatMark

    def line(self) -> str:
        from journal.features.memory.feature import Memory
        return Memory.MEMORY_WHISPERED_BACK.create(noun=self.noun, n=self.id, text=self.text).rendered()
