from dataclasses import dataclass, field, replace
from typing import ClassVar
from engine.fields import Loaded


@dataclass(frozen=True)
class TypedEvent(Loaded):
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
        return replace(cls.from_json(event.data), n=event.n, action=event.action, type=event.type, actor=event.actor)


@dataclass(frozen=True)
class AnyEvent(ResourceEvent):
    on: ClassVar[str] = "*"


@dataclass(frozen=True)
class ResourceCreated(ResourceEvent):
    on: ClassVar[str] = "created"


@dataclass(frozen=True)
class AgentEvent(TypedEvent):
    agent: int = 0

    @classmethod
    def read(cls, event) -> "AgentEvent":
        return replace(cls.from_json(event.data), agent=event.n)


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
        return str(self.data["text"])

    def change(self, text: str) -> None:
        self.data["text"] = text

    def stop(self) -> None:
        self.data["stopped"] = True


@dataclass(frozen=True)
class AgentMessageSent(AgentEvent):
    on: ClassVar[str] = "agent.message.sent"
    text: str = ""


@dataclass(frozen=True)
class AgentReported(AgentEvent):
    on: ClassVar[str] = "agent.reported"
    hook_name: ClassVar[str] = ""
    hook: str = ""
    tool: str = ""
    file: str = ""
    session: str = ""
    size: int = 0
    skill: str = ""

    def wanted(self) -> bool:
        return not self.hook_name or self.hook == self.hook_name


@dataclass(frozen=True)
class SessionStarted(AgentReported):
    hook_name: ClassVar[str] = "SessionStart"
    event_name: ClassVar[str] = "agent.session.started"


@dataclass(frozen=True)
class PromptSubmitted(AgentReported):
    hook_name: ClassVar[str] = "UserPromptSubmit"
    event_name: ClassVar[str] = "agent.prompt.submitted"


@dataclass(frozen=True)
class ToolStarted(AgentReported):
    hook_name: ClassVar[str] = "PreToolUse"
    event_name: ClassVar[str] = "agent.tool.started"


@dataclass(frozen=True)
class ToolFinished(AgentReported):
    hook_name: ClassVar[str] = "PostToolUse"
    event_name: ClassVar[str] = "agent.tool.finished"


@dataclass(frozen=True)
class TurnStopped(AgentReported):
    hook_name: ClassVar[str] = "Stop"
    event_name: ClassVar[str] = "agent.turn.stopped"


@dataclass(frozen=True)
class ContextCompacting(AgentReported):
    hook_name: ClassVar[str] = "PreCompact"
    event_name: ClassVar[str] = "agent.context.compacting"


@dataclass(frozen=True)
class SessionEnded(AgentReported):
    hook_name: ClassVar[str] = "SessionEnd"
    event_name: ClassVar[str] = "agent.session.ended"


@dataclass(frozen=True)
class PermissionRequested(AgentReported):
    hook_name: ClassVar[str] = "PermissionRequest"
    event_name: ClassVar[str] = "agent.permission.requested"
