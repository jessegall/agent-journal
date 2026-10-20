from dataclasses import dataclass

from journal.support.chat_mark import ChatMark


@dataclass(frozen=True)
class MemoryRow:
    """A fact, rule or reminder as the standing carries it: its noun, number, words, keywords and the chat's switch for it."""

    noun: str
    id: int
    text: str
    keywords: tuple[str, ...]
    mark: ChatMark
