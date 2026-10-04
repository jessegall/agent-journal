from dataclasses import dataclass, field
from typing import ClassVar

from engine.chat import SENDING, SENT
from engine.clock import TICKED
from engine.events.base import AgentEvent
from engine.files import EDITED
from engine.ran import COMMAND_RAN


@dataclass(frozen=True)
class ClockTicked(AgentEvent):
    on: ClassVar[str] = f"agent.{TICKED}"

    @classmethod
    def read(cls, event) -> "ClockTicked":
        return cls(agent=event.n)


@dataclass(frozen=True)
class AgentMessageSending(AgentEvent):
    on: ClassVar[str] = f"agent.{SENDING}"
    data: dict = field(default_factory=dict)

    @classmethod
    def read(cls, event) -> "AgentMessageSending":
        return cls(agent=event.n, data=event.data)

    @property
    def text(self) -> str:
        return str(self.data["text"])

    @property
    def turn(self) -> str:
        return str(self.data["turn"])

    def change(self, text: str) -> None:
        self.data["text"] = text

    def stop(self) -> None:
        self.data["stopped"] = True


@dataclass(frozen=True)
class AgentMessageSent(AgentEvent):
    on: ClassVar[str] = f"agent.{SENT}"
    text: str = ""
    turn: str = ""


@dataclass(frozen=True)
class CommandRan(AgentEvent):
    on: ClassVar[str] = f"agent.{COMMAND_RAN}"
    at: float = 0.0
    tool: str = ""
    command: str = ""
    output: str = ""


@dataclass(frozen=True)
class FileEdited(AgentEvent):
    on: ClassVar[str] = f"file.{EDITED}"
    at: float = 0.0
    path: str = ""
    kind: str = ""
    before: str = ""
    after: str = ""
    added: int = 0
    removed: int = 0
