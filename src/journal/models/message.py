from dataclasses import dataclass, field
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
    acknowledgement: bool = False
    files: tuple[str, ...] = ()
    """The names of the files attached, kept under the journal's files folder."""
    captions: dict = field(default_factory=dict)
    """What each attached picture shows, in the agent's words once it has opened it, so it can be found later."""
    """An agent's turn that only answered a journal line and changed nothing: kept, and left out of the chat unless shown."""
