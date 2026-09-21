from dataclasses import dataclass
from typing import ClassVar


@dataclass(frozen=True)
class TypedEvent:
    on: ClassVar[str] = ""

    @classmethod
    def read(cls, event) -> "TypedEvent":
        return cls()


@dataclass(frozen=True)
class AgentEvent(TypedEvent):
    agent: int = 0


@dataclass(frozen=True)
class AgentMessageCreated(AgentEvent):
    on: ClassVar[str] = "agent.said"
    text: str = ""

    @classmethod
    def read(cls, event) -> "AgentMessageCreated":
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
