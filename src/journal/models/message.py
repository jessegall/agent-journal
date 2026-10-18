from dataclasses import dataclass, field
from datetime import datetime

from journal.models.author import Author
from journal.models.scoped import Scoped


@dataclass(frozen=True)
class Message(Scoped):
    FACE_WORDS = 6

    author: Author = Author.USER
    text: str = ""
    reply_to: int | None = None
    read_at: datetime | None = None
    idempotency: str = ""
    """The key the sender gave it, so a message sent twice lands once and the viewer can match what it sent."""
    acknowledgement: bool = False
    """An agent's turn that only answered a journal line and changed nothing: kept, and left out of the chat unless shown."""
    files: tuple[str, ...] = ()
    """The names of the files attached, kept under the journal's files folder."""
    captions: dict = field(default_factory=dict)
    """What each attached picture shows, in the agent's words once it has opened it, so it can be found later."""
    data: dict = field(default_factory=dict)
    """A system message's card: its kind, icon, tone, detail, the row it opens and the session it belongs to."""

    @property
    def is_agents_reply(self) -> bool:
        return self.reply_to is not None and self.author == Author.AGENT

    @property
    def takes_a_face(self) -> bool:
        """A message of a few words, an ok or a thanks, is answered by a face; anything longer wants words."""
        return len(self.text.split()) <= self.FACE_WORDS
