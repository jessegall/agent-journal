from dataclasses import dataclass
from datetime import datetime

from journal.models.author import Author
from journal.models.scoped import Scoped


@dataclass(frozen=True)
class Message(Scoped):
    author: Author = Author.USER
    text: str = ""
    reply_to: int | None = None
    read_at: datetime | None = None
    idempotency: str = ""
    """The key the sender gave it, so a message sent twice lands once and the viewer can match what it sent."""
