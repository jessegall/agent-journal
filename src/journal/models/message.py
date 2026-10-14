from dataclasses import dataclass
from enum import StrEnum

from journal.models.base import Scoped


class Author(StrEnum):
    USER = "user"
    AGENT = "agent"


@dataclass(frozen=True)
class Message(Scoped):
    author: Author = Author.USER
    text: str = ""
    reply_to: int | None = None
    read_at: str | None = None
