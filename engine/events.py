from dataclasses import dataclass, field
from typing import ClassVar


@dataclass(frozen=True)
class TypedEvent:
    on: ClassVar[str] = ""

    @classmethod
    def read(cls, event) -> "TypedEvent":
        return cls()


@dataclass(frozen=True)
class ResourceEvent(TypedEvent):
    n: int = 0
    action: str = ""

    @classmethod
    def read(cls, event) -> "ResourceEvent":
        return cls(n=event.n, action=event.action)


@dataclass(frozen=True)
class AgentEvent(TypedEvent):
    agent: int = 0


@dataclass(frozen=True)
class AgentChanged(AgentEvent):
    on: ClassVar[str] = "agent"
    action: str = ""

    @classmethod
    def read(cls, event) -> "AgentChanged":
        return cls(agent=event.n, action=event.action)


@dataclass(frozen=True)
class AgentMessageSending(AgentEvent):
    on: ClassVar[str] = "agent.message.sending"
    data: dict = field(default_factory=dict)

    @classmethod
    def read(cls, event) -> "AgentMessageSending":
        return cls(agent=event.n, data=event.data)

    @property
    def text(self) -> str:
        return str(self.data.get("text") or "")

    def change(self, text: str) -> None:
        self.data["text"] = text

    def stop(self) -> None:
        self.data["stopped"] = True


@dataclass(frozen=True)
class AgentMessageSent(AgentEvent):
    on: ClassVar[str] = "agent.message.sent"
    text: str = ""

    @classmethod
    def read(cls, event) -> "AgentMessageSent":
        return cls(agent=event.n, text=str(event.data.get("text") or ""))


@dataclass(frozen=True)
class AgentUpdated(AgentEvent):
    on: ClassVar[str] = "agent.updated"
    hook: str = ""
    tool: str = ""
    file: str = ""
    session: str = ""

    @classmethod
    def read(cls, event) -> "AgentUpdated":
        return cls(agent=event.n, hook=str(event.data.get("hook") or ""), tool=str(event.data.get("tool") or ""),
                   file=str(event.data.get("file") or ""), session=str(event.data.get("session") or ""))
