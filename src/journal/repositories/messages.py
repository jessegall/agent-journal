from datetime import datetime, timezone

from journal.db.connection import Connection
from journal.events.bus import Bus
from journal.support.actor import Actor
from journal.models.author import Author
from journal.models.message import Message
from journal.repositories.links import Links
from journal.repositories.reactions import Reactions
from journal.repositories.scope import Scope
from journal.repositories.scoped_repository import ScopedRepository


class Messages(ScopedRepository[Message]):
    ANSWERS = "answers"
    SUBJECT_LINK = "about"
    COMMENT_LINK = "comments_on"

    model = Message

    def __init__(self, connection: Connection, bus: Bus, scope: Scope, reactions: Reactions, links: Links) -> None:
        super().__init__(connection, bus, scope)
        self.reactions, self.links = reactions, links

    def unread(self) -> list[Message]:
        return self.selected(self.query().filter(author=Author.USER).filter_null("read_at").order("id"))

    def last_user_message(self) -> Message | None:
        return next((m for m in self.selected(self.query().filter(author=Author.USER).order_descending("id").limit(20)) if not m.is_terminal_line), None)

    def unanswered(self) -> list[Message]:
        voiced_at = self.last_message()
        query = self.query().filter(author=Author.USER).filter_present("read_at")
        read = self.selected((query if voiced_at is None else query.filter_greater("read_at", voiced_at)).order("id"))
        return [m for m in read if not m.is_terminal_line and not self.answered(m) and not self.agent_reaction(m)]

    def last_message(self) -> str | None:
        return self.maximum(self.query().filter(author=Author.AGENT, acknowledgement=False).filter_unequal("data->kind", Message.THOUGHT), "created_at", None)

    def answered(self, message: Message) -> bool:
        return bool(self.selected_globally(self.query().filter(reply_target=message.id, author=Author.AGENT).limit(1))) or bool(self.links.sources(message, self.ANSWERS))

    def agent_reaction(self, message: Message) -> bool:
        return any(r.author == Author.AGENT for r in self.reactions.reactions(message))

    def peer_questions(self) -> list[Message]:
        questions = self.selected(self.query().filter_json("data->kind", Message.PEER).filter_json("data->asks", 1).order("id"))
        return [question for question in questions if not self.selected(self.query().filter_json("data->sent_to", question.data[Message.PEER]).filter_greater("id", question.id).limit(1))]

    def sent_with(self, key: str) -> list[Message]:
        return self.selected(self.query().filter(idempotency=key).order("id").limit(1))

    def window(self, last: int, previous: int = 0, following: int = 0) -> list[Message]:
        query = self.query().filter_greater("id", following)
        if previous:
            query = query.filter_less("id", previous)
        return list(reversed(self.selected(query.order_descending("id").limit(last))))

    def changes(self, time: datetime) -> list[Message]:
        return self.selected(self.query().filter_greater("updated_at", time).order("id").limit(500))

    def unviewed(self) -> int:
        return self.counted(self.query().filter(author=Author.AGENT).filter_null("read_at"))

    def visitor_messages(self, share_id: int) -> list[Message]:
        return self.selected(self.query().filter_json("data->share", share_id).order("id"))

    def keyed(self, key: str, actor: Actor) -> list[Message]:
        return self.selected(self.query().filter_json("data->key", key).filter(creator=actor))

    def with_key(self, key: str) -> list[Message]:
        return self.selected(self.query().filter_json("data->key", key))

    def keyed_all(self, key: str, actor: Actor) -> list[Message]:
        return self.selected_globally(self.query().filter_json("data->key", key).filter(creator=actor))

    def replies(self, message: Message) -> list[Message]:
        matched = self.selected(self.query().filter(reply_target=message.id, author=Author.AGENT).order("id"))
        linked = [self.find(ref.id) for ref in self.links.sources(message, self.ANSWERS)]
        return sorted([*matched, *linked], key=lambda m: m.row_id)

    def first_reply(self, message: Message) -> Message | None:
        replies = self.replies(message)
        return replies[0] if replies else None

    def recent_replies(self, time: datetime) -> list[Message]:
        return self.selected(self.query().filter(author=Author.AGENT).filter_present("reply_target").filter_greater_equal("created_at", time).order("id"))

    def reply_text(self, n: int, text: str) -> list[Message]:
        return self.selected(self.query().filter(reply_target=n, author=Author.AGENT, text=text.strip()))

    def recent(self, last: int) -> list[Message]:
        return self.window(last)

    def thoughts(self, session: str, last: int = 60) -> list[Message]:
        rows = self.selected(self.query().filter(creator=Actor.agent(session)).filter_json("data->kind", Message.THOUGHT).order_descending("id").limit(last))
        return list(reversed(rows))

    def read(self, message: Message, actor: Actor, tool_use: int) -> Message:
        return message if message.read_at else self.save(message.with_(read_at=datetime.now(timezone.utc), read_position=tool_use), actor)
