from dataclasses import dataclass, field
from datetime import datetime
from typing import ClassVar

from journal.events.rows.message_arrived import MessageArrived
from journal.models.author import Author
from journal.models.scoped import Scoped
TERMINAL_LINE = "typed"


@dataclass(frozen=True)
class Message(Scoped):
    text_fields: ClassVar[tuple[str, ...]] = ("text",)

    THOUGHT = "thought"
    REPORT = "report"
    PEER = "peer"
    RECIPIENT_KEY = "sent_to"

    author: Author = Author.USER
    text: str = ""
    reply_to: int | None = None
    read_at: datetime | None = None
    read_mark: int = 0
    idempotency: str = ""
    acknowledgement: bool = False
    files: tuple[str, ...] = ()
    captions: dict = field(default_factory=dict)
    data: dict = field(default_factory=dict)

    @classmethod
    def agent_message(cls, sender: str, text: str, session: str, time: datetime) -> "Message":
        return cls(author=Author.SYSTEM, text=text, read_at=time, data={"kind": cls.PEER, cls.PEER: sender, "session": session})

    @classmethod
    def sent_to(cls, receiver: str, text: str, session: str, address: str = "") -> "Message":
        return cls(author=Author.SYSTEM, text=text, data={"kind": cls.PEER, cls.RECIPIENT_KEY: receiver, "session": session, "address": address or receiver})

    @classmethod
    def send_failed(cls, receiver: str, text: str, session: str, address: str, reason: str) -> "Message":
        return cls(author=Author.SYSTEM, text=text, data={"kind": cls.PEER, cls.RECIPIENT_KEY: receiver, "session": session, "address": address or receiver, "failure": reason})

    def arrived(self) -> "Message":
        return self.with_event(MessageArrived(text=self.text))

    @property
    def sender(self) -> str:
        return self.data[self.PEER] if self.PEER in self.data else f"the {self.author}"

    @property
    def is_agents_reply(self) -> bool:
        return self.reply_to is not None and self.author == Author.AGENT

    @property
    def quoted_lines(self) -> int:
        lines = self.text.split("\n")
        return next((i for i, line in enumerate(lines) if not line.startswith(">")), len(lines))

    @property
    def is_passage_comment(self) -> bool:
        return self.quoted_lines > 0 and self.reply_to is None

    @property
    def quote(self) -> str:
        return "\n".join(line.removeprefix(">").strip() for line in self.text.split("\n")[: self.quoted_lines])

    @property
    def own_words(self) -> str:
        return "\n".join(self.text.split("\n")[self.quoted_lines:]).strip()

    @property
    def is_thought(self) -> bool:
        return self.data.get("kind") == self.THOUGHT

    @property
    def is_terminal_line(self) -> bool:
        return self.data.get("kind") == TERMINAL_LINE

    @property
    def speaks_to_the_user(self) -> bool:
        return self.author == Author.AGENT and not self.acknowledgement and not self.is_thought

