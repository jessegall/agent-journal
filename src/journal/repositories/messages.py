from journal.models.message import Message
from journal.repositories.base import ScopedRepository


class Messages(ScopedRepository[Message]):
    model = Message

    def unread(self, environment_id: int) -> list[Message]: ...
