from journal.models.message import Message
from journal.repositories.scoped_repository import ScopedRepository


class Messages(ScopedRepository[Message]):
    model = Message

    def unread(self, environment_id: int) -> list[Message]:
        return [m for m in self.in_(environment_id) if m.read_at is None]
