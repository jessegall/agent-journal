from datetime import datetime, timezone

from journal.db.connection import Connection
from journal.features.bus import Bus
from journal.models.actor import Actor
from journal.models.author import Author
from journal.models.message import Message
from journal.repositories.links import Links
from journal.repositories.reactions import Reactions
from journal.repositories.scoped_repository import ScopedRepository


class Messages(ScopedRepository[Message]):
    model = Message

    ANSWERS = "answers"
    """The link from a reply to each further message it answers, beyond the one it is a reply to."""
    ABOUT = "about"
    """The link from a message of the user's to a task filed from it."""
    COMMENTS_ON = "comments_on"
    """The link from a message of the user's to the row it was written under in the viewer: a comment on a task, a doc, a plan."""

    def __init__(self, connection: Connection, bus: Bus, reactions: Reactions, links: Links) -> None:
        super().__init__(connection, bus)
        self.reactions, self.links = reactions, links

    def unread(self, environment_id: int) -> list[Message]:
        """What the user left that the agent has not read."""
        return [m for m in self.in_(environment_id) if m.read_at is None and m.author == Author.USER]

    def unanswered(self, environment_id: int) -> list[Message]:
        """The user's messages read and not heard back on: no reply, no face on one of a few words, and no message of the agent's in the chat since the read."""
        rows = self.in_(environment_id)
        replied = {m.reply_to for m in rows if m.reply_to and m.author == Author.AGENT}
        replied |= {ref.id for m in rows if m.reply_to and m.author == Author.AGENT for ref in self.links.targets(m, self.ANSWERS)}
        spoke = [m.created_at for m in rows if m.author == Author.AGENT and not m.acknowledgement]
        return [m for m in rows if m.author == Author.USER and m.read_at is not None and m.id not in replied and not (m.takes_a_face and self.reacted_by_agent(m)) and not any(at > m.read_at for at in spoke)]

    def reacted_by_agent(self, message: Message) -> bool:
        return any(r.author == Author.AGENT for r in self.reactions.on(message))

    def recent(self, environment_id: int, last: int) -> list[Message]:
        return self.in_(environment_id)[-last:]

    def mark_read(self, message: Message, by: Actor) -> Message:
        return message if message.read_at else self.save(message.with_(read_at=datetime.now(timezone.utc)), by)
