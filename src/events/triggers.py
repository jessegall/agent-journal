"""The moments of the trigger resource type, and what the triggers feature recognises: words it watches for and states of the journal it keeps showing the agent."""

from dataclasses import dataclass
from typing import ClassVar

from events import Fact
from events.resources import ResourceEvent
from resources.base import FIRED


@dataclass(frozen=True)
class TriggerCreated(ResourceEvent):
    on: ClassVar[str] = "trigger.created"


@dataclass(frozen=True)
class TriggerUpdated(ResourceEvent):
    on: ClassVar[str] = "trigger.updated"


@dataclass(frozen=True)
class TriggerCompleted(ResourceEvent):
    on: ClassVar[str] = "trigger.completed"


@dataclass(frozen=True)
class TriggerFired(ResourceEvent):
    on: ClassVar[str] = f"trigger.{FIRED}"
    about: str = ""


@dataclass(frozen=True, kw_only=True)
class TriggerMet(Fact):
    """A trigger's words came up, in the user's message, the agent's message or a call the agent made."""

    agent: int
    row: int
    done: str = ""
    about: str = ""


@dataclass(frozen=True, kw_only=True)
class ChatWordDenied(Fact):
    """The agent wrote a word a trigger denies in its message to the chat."""

    agent: int
    row: int


@dataclass(frozen=True, kw_only=True)
class TriggerShowing(Fact):
    """A state of the journal a trigger watches, which the agent is to be told."""

    agent: int
    row: int
    does: str
    key: str
    values: tuple[tuple[str, object], ...]


@dataclass(frozen=True, kw_only=True)
class TriggerHolding(Fact):
    """A state of the journal a trigger watches holds the agent until it passes."""

    agent: int
    row: int
    title: str
    text: str


@dataclass(frozen=True, kw_only=True)
class TriggerReleased(Fact):
    """The state a trigger held the agent for is gone."""

    agent: int
    row: int
