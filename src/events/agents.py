"""The moments of the agent resource type."""

from dataclasses import dataclass, field
from typing import ClassVar

from events import Event, Request
from events.resources import ResourceEvent, RowAction
from events.typed import AgentEvent


SENDING, SENT, WRITTEN = "message.sending", "message.sent", "message.written"
TICKED, BEAT = "ticked", "beat"
COMMAND_RAN = "command.ran"
TOOL_ANSWERED = "tool.answered"


@dataclass(frozen=True)
class AgentCreated(ResourceEvent):
    on: ClassVar[str] = "agent.created"


@dataclass(frozen=True)
class AgentUpdated(ResourceEvent):
    on: ClassVar[str] = "agent.updated"


@dataclass(frozen=True)
class AgentCompleted(ResourceEvent):
    on: ClassVar[str] = "agent.completed"


@dataclass(frozen=True)
class AgentChanged(AgentEvent, RowAction):
    on: ClassVar[str] = "agent"

    @classmethod
    def read(cls, event) -> "AgentChanged":
        return cls(agent=event.n, action=event.action)


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
    compacted: bool = False

    @classmethod
    def name(cls) -> str:
        return f"hook.{cls.hook_name}" if cls.hook_name else cls.on

    @classmethod
    def patterns(cls, hooks: tuple[str, ...]) -> tuple[str, ...]:
        named = hooks or ((cls.hook_name,) if cls.hook_name else ())
        return tuple(f"hook.{hook}" for hook in named) or (cls.on,)

    def wanted(self) -> bool:
        return not self.hook_name or self.hook == self.hook_name


@dataclass(frozen=True)
class SessionStarted(AgentReported):
    hook_name: ClassVar[str] = "SessionStart"


@dataclass(frozen=True)
class ToolFinished(AgentReported):
    hook_name: ClassVar[str] = "PostToolUse"


@dataclass(frozen=True)
class TurnStopped(AgentReported):
    hook_name: ClassVar[str] = "Stop"


@dataclass(frozen=True)
class ClockTicked(AgentEvent):
    on: ClassVar[str] = f"agent.{TICKED}"

    @classmethod
    def read(cls, event) -> "ClockTicked":
        return cls(agent=event.n)


@dataclass(frozen=True)
class AgentBeat(AgentEvent):
    on: ClassVar[str] = f"agent.{BEAT}"

    @classmethod
    def read(cls, event) -> "AgentBeat":
        return cls(agent=event.n)


@dataclass(frozen=True)
class BusMessageSending(AgentEvent):
    """The bus event a handler may rewrite or stop; events.asking.AgentMessageSending is the engine's request of the same moment."""

    on: ClassVar[str] = f"agent.{SENDING}"
    marked_as: ClassVar[type[Event]] = Request
    data: dict = field(default_factory=dict)

    @classmethod
    def read(cls, event) -> "BusMessageSending":
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
class ToolCallAnswered(AgentEvent):
    """A tool call the gate answered: what was asked, and why it was refused, empty when it may run. Told after the answer, so what writes about it never holds the call up."""

    on: ClassVar[str] = f"agent.{TOOL_ANSWERED}"
    tool: str = ""
    input: str = ""
    why: str = ""
    subagent: bool = False
    cwd: str = ""
    paths: tuple[str, ...] = ()


@dataclass(frozen=True)
class AgentTurnWritten(AgentEvent):
    """A turn as the agent wrote it, tags and all, whether or not its words reach the chat."""

    on: ClassVar[str] = f"agent.{WRITTEN}"
    text: str = ""
    turn: str = ""


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
    stepped: bool = False
