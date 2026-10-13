"""The moments of the message resource type."""

from dataclasses import dataclass, replace
from typing import ClassVar

from events import Fact
from events.resources import ResourceEvent


@dataclass(frozen=True)
class MessageCreated(ResourceEvent):
    on: ClassVar[str] = "message.created"


@dataclass(frozen=True)
class MessageCompleted(ResourceEvent):
    on: ClassVar[str] = "message.completed"


@dataclass(frozen=True)
class MessageRequested(ResourceEvent):
    on: ClassVar[str] = "message.requested"


@dataclass(frozen=True)
class MessageRevised(ResourceEvent):
    on: ClassVar[str] = "message.revised"


@dataclass(frozen=True)
class MessageCommissioned(ResourceEvent):
    on: ClassVar[str] = "message.commissioned"


@dataclass(frozen=True)
class MessageUpdated(ResourceEvent):
    on: ClassVar[str] = "message.updated"
    numbers: tuple = ()
    file: str = ""

    @classmethod
    def read(cls, event) -> "MessageUpdated":
        return replace(super().read(event), numbers=tuple(event.data.get("numbers") or [event.n]))


@dataclass(frozen=True, kw_only=True)
class TurnToPost(Fact):
    """The agent's turn reached the chat and is to be shown as its message."""

    agent: int
    text: str
    turn: str


@dataclass(frozen=True, kw_only=True)
class FaceSent(Fact):
    """The agent's turn was only a face, which is a reaction and not a reply."""

    agent: int
    face: str


@dataclass(frozen=True, kw_only=True)
class InboxRearmed(Fact):
    """A message arrived, so the agent's count towards the next reminder of its inbox starts again."""

    agent: int
    uses: int


@dataclass(frozen=True, kw_only=True)
class AnswerRearmed(Fact):
    """A message arrived, so the agent's count of reminders to answer starts again from its tool uses now."""

    agent: int
    uses: int


@dataclass(frozen=True, kw_only=True)
class InboxSettled(Fact):
    """Nothing in the inbox needs the agent's attention now."""

    agent: int


@dataclass(frozen=True, kw_only=True)
class InboxUnread(Fact):
    """Messages wait unread in the agent's inbox."""

    agent: int


@dataclass(frozen=True, kw_only=True)
class AnswersSettled(Fact):
    """No message the agent has read is left without an answer."""

    agent: int


@dataclass(frozen=True, kw_only=True)
class AnswerWaitBegan(Fact):
    """A read message began to wait for an answer at this tool use of the agent."""

    agent: int
    uses: int


@dataclass(frozen=True, kw_only=True)
class AnswerHeld(Fact):
    """A read message has waited so long that the agent's writes are held until it is answered."""

    agent: int
    messages: str


@dataclass(frozen=True, kw_only=True)
class AnswerOwed(Fact):
    """These read messages are owed an answer."""

    agent: int
    messages: str
    numbers: tuple[int, ...]
    rows: tuple[str, ...]


@dataclass(frozen=True, kw_only=True)
class MessageSettled(Fact):
    """A message counts as handled, in these words."""

    n: int
    how: str


@dataclass(frozen=True, kw_only=True)
class RunTogether(Fact):
    """The agent's last turn is one long block that wants paragraphs."""

    agent: int


@dataclass(frozen=True, kw_only=True)
class BareNumbersNamed(Fact):
    """The agent's turn named rows by a bare number, in the words of the last message it sent."""

    agent: int
    n: int
    numbers: str
