from dataclasses import dataclass

from journal.models.author import Author
from journal.models.scoped import Scoped


@dataclass(frozen=True)
class Message(Scoped):
    author: Author = Author.USER
    text: str = ""
    reply_to: int | None = None
    read_at: str | None = None
