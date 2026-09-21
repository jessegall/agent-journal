from dataclasses import dataclass, field
from typing import ClassVar


@dataclass(frozen=True)
class TypedEvent:
    on: ClassVar[str] = ""
    event_name: ClassVar[str] = ""

    @classmethod
    def read(cls, event) -> "TypedEvent":
        return cls()

    def wanted(self) -> bool:
        return True


@dataclass(frozen=True)
class ResourceEvent(TypedEvent):
    n: int = 0
    action: str = ""
    type: str = ""
    actor: str = ""

    @classmethod
    def read(cls, event) -> "ResourceEvent":
        return cls(n=event.n, action=event.action, type=event.type, actor=event.actor)


@dataclass(frozen=True)
class AnyEvent(ResourceEvent):
    on: ClassVar[str] = "*"


@dataclass(frozen=True)
class ResourceCreated(ResourceEvent):
    on: ClassVar[str] = "created"


@dataclass(frozen=True)
class AgentEvent(TypedEvent):
    agent: int = 0


@dataclass(frozen=True)
class ClockTicked(AgentEvent):
    on: ClassVar[str] = "agent.ticked"

    @classmethod
    def read(cls, event) -> "ClockTicked":
        return cls(agent=event.n)


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
    hook_name: ClassVar[str] = ""
    hook: str = ""
    tool: str = ""
    file: str = ""
    session: str = ""
    size: int = 0
    skill: str = ""

    @classmethod
    def read(cls, event) -> "AgentUpdated":
        return cls(agent=event.n, hook=str(event.data.get("hook") or ""), tool=str(event.data.get("tool") or ""),
                   file=str(event.data.get("file") or ""), session=str(event.data.get("session") or ""),
                   size=int(event.data.get("size") or 0), skill=str(event.data.get("skill") or ""))

    def wanted(self) -> bool:
        return not self.hook_name or self.hook == self.hook_name


@dataclass(frozen=True)
class SessionStarted(AgentUpdated):
    hook_name: ClassVar[str] = "SessionStart"
    event_name: ClassVar[str] = "agent.session.started"


@dataclass(frozen=True)
class PromptSubmitted(AgentUpdated):
    hook_name: ClassVar[str] = "UserPromptSubmit"
    event_name: ClassVar[str] = "agent.prompt.submitted"


@dataclass(frozen=True)
class ToolStarted(AgentUpdated):
    hook_name: ClassVar[str] = "PreToolUse"
    event_name: ClassVar[str] = "agent.tool.started"


@dataclass(frozen=True)
class ToolFinished(AgentUpdated):
    hook_name: ClassVar[str] = "PostToolUse"
    event_name: ClassVar[str] = "agent.tool.finished"


@dataclass(frozen=True)
class TurnStopped(AgentUpdated):
    hook_name: ClassVar[str] = "Stop"
    event_name: ClassVar[str] = "agent.turn.stopped"


@dataclass(frozen=True)
class ContextCompacting(AgentUpdated):
    hook_name: ClassVar[str] = "PreCompact"
    event_name: ClassVar[str] = "agent.context.compacting"


@dataclass(frozen=True)
class SessionEnded(AgentUpdated):
    hook_name: ClassVar[str] = "SessionEnd"
    event_name: ClassVar[str] = "agent.session.ended"


@dataclass(frozen=True)
class PermissionRequested(AgentUpdated):
    hook_name: ClassVar[str] = "PermissionRequest"
    event_name: ClassVar[str] = "agent.permission.requested"
