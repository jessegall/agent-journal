from datetime import datetime, timezone

from journal.db.connection import Connection
from journal.features.bus import Bus
from journal.models.actor import Actor
from journal.models.author import Author
from journal.models.message import Message
from journal.repositories.reactions import Reactions
from journal.repositories.scoped_repository import ScopedRepository


class Messages(ScopedRepository[Message]):
    model = Message

    def __init__(self, connection: Connection, bus: Bus, reactions: Reactions) -> None:
        super().__init__(connection, bus)
        self.reactions = reactions

    def unread(self, environment_id: int) -> list[Message]:
        """What the user left that the agent has not read."""
        return [m for m in self.in_(environment_id) if m.read_at is None and m.author == Author.USER]

    def unanswered(self, environment_id: int) -> list[Message]:
        """What the user left that the agent has read and neither replied to nor put a face on."""
        rows = self.in_(environment_id)
        replied = {m.reply_to for m in rows if m.reply_to and m.author == Author.AGENT}
        return [m for m in rows if m.author == Author.USER and m.read_at is not None and m.id not in replied and not self.reacted_by_agent(m)]

    def reacted_by_agent(self, message: Message) -> bool:
        return any(r.author == Author.AGENT for r in self.reactions.on(message))

    def recent(self, environment_id: int, last: int) -> list[Message]:
        return self.in_(environment_id)[-last:]

    def mark_read(self, message: Message, by: Actor) -> Message:
        return message if message.read_at else self.save(message.with_(read_at=datetime.now(timezone.utc)), by)
