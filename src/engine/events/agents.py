from dataclasses import dataclass
from typing import ClassVar

from engine.events.base import AgentEvent


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
