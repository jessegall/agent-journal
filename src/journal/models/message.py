from dataclasses import dataclass, field
from datetime import datetime
from typing import ClassVar

from journal.events.rows.colleague_commented import ColleagueCommented
from journal.events.rows.message_arrived import MessageArrived
from journal.models.agent_role import AgentRole
from journal.models.author import Author
from journal.models.scoped import Scoped
TERMINAL_LINE = "typed"


@dataclass(frozen=True)
class Message(Scoped):
    """A bubble of a chat: who wrote it, its words and files, and the session and kind of the agent whose chat it is in."""

    text_fields: ClassVar[tuple[str, ...]] = ("text",)

    THOUGHT = "thought"
    REPORT = "report"
    PEER = "peer"
    COLLEAGUE_NAME = "colleague"
    COLLEAGUE_USER = "colleague_user"
    VIEWED = "viewed"
    TEAMMATE = "teammate"
    RECIPIENT_KEY = "sent_to"
    ASKS_KEY = "asks"

    author: Author = Author.USER
    session: str | None = None
    agent_role: AgentRole = AgentRole.MAIN
    text: str = ""
    reply_target: int | None = None
    read_at: datetime | None = None
    read_position: int = 0
    idempotency: str = ""
    acknowledgement: bool = False
    files: tuple[str, ...] = ()
    captions: dict = field(default_factory=dict)
    data: dict = field(default_factory=dict)

    @classmethod
    def agent_message(cls, sender: str, text: str, session: str, time: datetime, asks: bool) -> "Message":
        return cls(author=Author.SYSTEM, text=text, read_at=time, session=session, data={"kind": cls.PEER, cls.PEER: sender, cls.ASKS_KEY: asks})

    @classmethod
    def outgoing(cls, receiver: str, text: str, session: str, address: str = "") -> "Message":
        return cls(author=Author.SYSTEM, text=text, session=session, data={"kind": cls.PEER, cls.RECIPIENT_KEY: receiver, "address": address or receiver})

    @classmethod
    def send_failed(cls, receiver: str, text: str, session: str, address: str, reason: str) -> "Message":
        return cls(author=Author.SYSTEM, text=text, session=session, data={"kind": cls.PEER, cls.RECIPIENT_KEY: receiver, "address": address or receiver, "failure": reason})

    @classmethod
    def answer(cls, target: "Message", text: str) -> "Message":
        if target.agent_role == AgentRole.MAIN:
            return cls(author=Author.AGENT, text=text, reply_target=target.id)
        return cls(author=Author.AGENT, text=text, reply_target=target.id, session=target.session, agent_role=target.agent_role)

    def authored(self, session: str | None) -> "Message":
        return self.with_(session=session) if self.is_new and self.session is None else self

    def arrived(self) -> "Message":
        return self.with_event(MessageArrived(text=self.text))

    def is_comment(self) -> bool:
        return self.author == Author.COLLEAGUE

    def viewed(self) -> "Message":
        return self.with_merged("data", {self.VIEWED: 1})

    def is_unsaved_user_message(self) -> bool:
        return self.is_new and self.author == Author.USER and self.agent_role == AgentRole.MAIN

    def commented(self, name: str, user: int) -> "Message":
        comment = self.without_events().with_(author=Author.COLLEAGUE).with_merged("data", {self.COLLEAGUE_NAME: name, self.COLLEAGUE_USER: user, self.VIEWED: 0})
        return comment.with_event(ColleagueCommented(text=self.text, colleague=name))

    @property
    def sender(self) -> str:
        if self.author == Author.COLLEAGUE:
            return f"{self.data[self.COLLEAGUE_NAME]}, a colleague of your user (not your user's words)"
        if self.TEAMMATE in self.data:
            return f"{self.data[self.TEAMMATE]}, one of the people you work for in the Team chat"
        return self.data[self.PEER] if self.PEER in self.data else f"the {self.author}"

    @property
    def is_agents_reply(self) -> bool:
        return self.reply_target is not None and self.author == Author.AGENT

    @property
    def quoted_lines(self) -> int:
        lines = self.text.split("\n")
        return next((i for i, line in enumerate(lines) if not line.startswith(">")), len(lines))

    @property
    def is_passage_comment(self) -> bool:
        return self.quoted_lines > 0 and self.reply_target is None

    @property
    def quote(self) -> str:
        return "\n".join(line.removeprefix(">").strip() for line in self.text.split("\n")[: self.quoted_lines])

    @property
    def text_body(self) -> str:
        return "\n".join(self.text.split("\n")[self.quoted_lines:]).strip()

    @property
    def is_thought(self) -> bool:
        return self.data.get("kind") == self.THOUGHT

    @property
    def is_terminal_line(self) -> bool:
        return self.data.get("kind") == TERMINAL_LINE

    @property
    def is_main_unread(self) -> bool:
        return self.author == Author.USER and self.read_at is None and self.agent_role == AgentRole.MAIN

    @property
    def is_user_facing(self) -> bool:
        return self.author == Author.AGENT and not self.acknowledgement and not self.is_thought

