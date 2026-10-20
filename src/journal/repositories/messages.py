from datetime import datetime, timezone

from journal.db.connection import Connection
from journal.events.bus import Bus
from journal.support.actor import Actor
from journal.models.author import Author
from journal.models.message import Message
from journal.repositories.links import Links
from journal.repositories.reactions import Reactions
from journal.support.scope import Scope
from journal.repositories.scoped_repository import ScopedRepository


class Messages(ScopedRepository[Message]):
    ANSWERS = "answers"
    ABOUT = "about"
    COMMENTS_ON = "comments_on"

    model = Message

    def __init__(self, connection: Connection, bus: Bus, scope: Scope, reactions: Reactions, links: Links) -> None:
        super().__init__(connection, bus, scope)
        self.reactions, self.links = reactions, links

    def unread(self) -> list[Message]:
        return self.selected("author = ? AND read_at IS NULL ORDER BY id", (Author.USER.value,))

    def last_sent_by_user(self) -> Message | None:
        return next((m for m in self.selected("author = ? ORDER BY id DESC LIMIT 20", (Author.USER.value,)) if not m.is_typed_in_terminal), None)

    def unanswered(self) -> list[Message]:
        spoken_at = self.last_spoken()
        since = "" if spoken_at is None else " AND read_at > ?"
        params = (Author.USER.value,) + (() if spoken_at is None else (spoken_at,))
        read = self.selected(f"author = ? AND read_at IS NOT NULL{since} ORDER BY id", params)
        return [m for m in read if not m.is_typed_in_terminal and not self.answered(m) and not self.reacted_by_agent(m)]

    def last_spoken(self) -> str | None:
        row = self.aggregate("max(created_at) AS at", "author = ? AND acknowledgement = 0 AND coalesce(json_extract(data, '$.kind'), '') != ?", (Author.AGENT.value, Message.THOUGHT))
        return row["at"] if row else None

    def answered(self, message: Message) -> bool:
        replied = self.connection.one("SELECT id FROM messages WHERE reply_to = ? AND author = ? LIMIT 1", (message.id, Author.AGENT.value))
        return replied is not None or bool(self.links.sources(message, self.ANSWERS))

    def reacted_by_agent(self, message: Message) -> bool:
        return any(r.author == Author.AGENT for r in self.reactions.on(message))

    def sent_with(self, key: str) -> list[Message]:
        return self.selected("idempotency = ? ORDER BY id LIMIT 1", (key,))

    def window(self, last: int, before: int = 0, after: int = 0) -> list[Message]:
        clause, params = ["id > ?"], [after]
        if before:
            clause.append("id < ?")
            params.append(before)
        return list(reversed(self.selected(f"{' AND '.join(clause)} ORDER BY id DESC LIMIT ?", (*params, last))))

    def changed_since(self, at: datetime) -> list[Message]:
        return self.selected("updated_at > ? ORDER BY id LIMIT 500", (at.isoformat(),))

    def count_in(self) -> int:
        return self.counted_in()

    def unseen_by_user(self) -> int:
        return self.counted_in("author = ? AND read_at IS NULL", (Author.AGENT.value,))

    def from_visitors(self, share_id: int) -> list[Message]:
        return self.selected("json_extract(data, '$.share') = ? ORDER BY id", (share_id,))

    def keyed(self, key: str, by: Actor) -> list[Message]:
        return self.selected("json_extract(data, '$.key') = ? AND created_by = ?", (key, by.stamp))

    def keyed_anywhere(self, key: str, by: Actor) -> list[Message]:
        return self.selected_everywhere("json_extract(data, '$.key') = ? AND created_by = ?", (key, by.stamp))

    def first_reply(self, message: Message) -> Message | None:
        named = self.selected("reply_to = ? AND author = ? ORDER BY id LIMIT 1", (message.id, Author.AGENT.value))
        linked = [self.find(ref.id) for ref in self.links.sources(message, self.ANSWERS)]
        replies = sorted([*named, *linked], key=lambda m: m.id)
        return replies[0] if replies else None

    def replies_since(self, at: datetime) -> list[Message]:
        return self.selected("author = ? AND reply_to IS NOT NULL AND created_at >= ? ORDER BY id", (Author.AGENT.value, at.isoformat()))

    def reply_saying(self, n: int, text: str) -> list[Message]:
        return self.selected("reply_to = ? AND author = ? AND text = ?", (n, Author.AGENT.value, text.strip()))

    def recent(self, last: int) -> list[Message]:
        return self.window(last)

    def thoughts_of(self, session: str, last: int = 60) -> list[Message]:
        rows = self.selected("created_by = ? AND json_extract(data, '$.kind') = ? ORDER BY id DESC LIMIT ?", (Actor.agent(session).stamp, Message.THOUGHT, last))
        return list(reversed(rows))

    def mark_read(self, message: Message, by: Actor) -> Message:
        return message if message.read_at else self.save(message.with_(read_at=datetime.now(timezone.utc)), by)
