from datetime import datetime, timezone

from journal.db.connection import Connection
from journal.events.bus import Bus
from journal.models.actor import Actor
from journal.models.author import Author
from journal.models.message import Message
from journal.repositories.links import Links
from journal.repositories.reactions import Reactions
from journal.repositories.scope import Scope
from journal.repositories.scoped_repository import ScopedRepository


class Messages(ScopedRepository[Message]):
    ANSWERS = "answers"
    """The link from a reply to each further message it answers, beyond the one it is a reply to."""
    ABOUT = "about"
    """The link from a message of the user's to a task filed from it."""
    COMMENTS_ON = "comments_on"
    """The link from a comment to the row it was written under: the user's in the viewer, or a visitor's on a shared page."""

    model = Message

    def __init__(self, connection: Connection, bus: Bus, scope: Scope, reactions: Reactions, links: Links) -> None:
        super().__init__(connection, bus, scope)
        self.reactions, self.links = reactions, links

    def unread(self) -> list[Message]:
        """What the user left that the agent has not read."""
        return self.selected("environment_id = ? AND author = ? AND read_at IS NULL ORDER BY id", (self.scope.id, Author.USER.value))

    def unanswered(self) -> list[Message]:
        """The user's messages read and not heard back on: no reply, no face on one of a few words, and no message of the agent's in the chat since the read; only those read after the agent last spoke can be one."""
        spoke = self.last_spoken()
        since = "" if spoke is None else " AND read_at > ?"
        params = (self.scope.id, Author.USER.value) + (() if spoke is None else (spoke,))
        read = self.selected(f"environment_id = ? AND author = ? AND read_at IS NOT NULL{since} ORDER BY id", params)
        return [m for m in read if not self.answered(m) and not (m.takes_a_face and self.reacted_by_agent(m))]

    def last_spoken(self) -> str | None:
        """When the agent last said something to the user: not a thought, not a turn that only acknowledged a journal line."""
        row = self.connection.one("SELECT max(created_at) AS at FROM messages WHERE environment_id = ? AND author = ? AND acknowledgement = 0 AND coalesce(json_extract(data, '$.kind'), '') != ?",
                                  (self.scope.id, Author.AGENT.value, Message.THOUGHT))
        return row["at"] if row else None

    def answered(self, message: Message) -> bool:
        """A reply names it, or a reply's link answers it."""
        replied = self.connection.one("SELECT id FROM messages WHERE reply_to = ? AND author = ? LIMIT 1", (message.id, Author.AGENT.value))
        return replied is not None or bool(self.links.sources(message, self.ANSWERS))

    def reacted_by_agent(self, message: Message) -> bool:
        return any(r.author == Author.AGENT for r in self.reactions.on(message))

    def sent_with(self, key: str) -> list[Message]:
        """The message the sender already sent with this key, so one sent twice lands once."""
        return self.selected("environment_id = ? AND idempotency = ? ORDER BY id LIMIT 1", (self.scope.id, key))

    def window(self, last: int, before: int = 0, after: int = 0) -> list[Message]:
        """At most last of the newest messages numbered above after and below before, oldest first."""
        clause, params = ["environment_id = ?", "id > ?"], [self.scope.id, after]
        if before:
            clause.append("id < ?")
            params.append(before)
        return list(reversed(self.selected(f"{' AND '.join(clause)} ORDER BY id DESC LIMIT ?", (*params, last))))

    def changed_since(self, at: datetime) -> list[Message]:
        return self.selected("environment_id = ? AND updated_at > ? ORDER BY id LIMIT 500", (self.scope.id, at.isoformat()))

    def numbered(self, ids: tuple[int, ...]) -> list[Message]:
        return self.selected(f"environment_id = ? AND id IN ({', '.join('?' for _ in ids)}) ORDER BY id", (self.scope.id, *ids))

    def count_in(self) -> int:
        return self.connection.one("SELECT count(*) AS n FROM messages WHERE environment_id = ?", (self.scope.id,))["n"]

    def unseen_by_user(self) -> int:
        """How many of the agent's messages the user has not seen yet."""
        return self.connection.one("SELECT count(*) AS n FROM messages WHERE environment_id = ? AND author = ? AND read_at IS NULL", (self.scope.id, Author.AGENT.value))["n"]

    def from_visitors(self, share_id: int) -> list[Message]:
        """The comments visitors left through a link, oldest first."""
        return self.selected("environment_id = ? AND json_extract(data, '$.share') = ? ORDER BY id", (self.scope.id, share_id))

    def keyed(self, key: str, by: Actor) -> list[Message]:
        return self.selected("environment_id = ? AND json_extract(data, '$.key') = ? AND created_by = ?", (self.scope.id, key, by.stamp))

    def recent(self, last: int) -> list[Message]:
        return self.window(last)

    def thoughts_of(self, session: str, last: int = 60) -> list[Message]:
        """The session's latest thoughts, oldest first."""
        rows = self.selected("environment_id = ? AND created_by = ? AND json_extract(data, '$.kind') = ? ORDER BY id DESC LIMIT ?", (self.scope.id, Actor.agent(session).stamp, Message.THOUGHT, last))
        return list(reversed(rows))

    def mark_read(self, message: Message, by: Actor) -> Message:
        return message if message.read_at else self.save(message.with_(read_at=datetime.now(timezone.utc)), by)
