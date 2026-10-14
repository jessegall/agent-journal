from datetime import datetime, timezone

from journal.models.actor import Actor
from journal.models.author import Author
from journal.models.message import Message
from journal.repositories.scoped_repository import ScopedRepository


class Messages(ScopedRepository[Message]):
    model = Message

    def unread(self, environment_id: int) -> list[Message]:
        """What the user left that the agent has not read."""
        return [m for m in self.in_(environment_id) if m.read_at is None and m.author == Author.USER]

    def mark_read(self, message: Message, by: Actor) -> Message:
        return message if message.read_at else self.save(message.with_(read_at=datetime.now(timezone.utc)), by)
