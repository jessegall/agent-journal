from dataclasses import dataclass
from enum import StrEnum


class HookKind(StrEnum):
    SESSION_START = "SessionStart"
    USER_PROMPT = "UserPromptSubmit"
    PRE_TOOL_USE = "PreToolUse"
    POST_TOOL_USE = "PostToolUse"
    PRE_COMPACT = "PreCompact"
    STOP = "Stop"
    SESSION_END = "SessionEnd"


@dataclass(frozen=True)
class Hook:
    """What the agent's hook script posts, as the agent sent it."""

    kind: HookKind
    session: str
    environment: str
    tool: str = ""
    input: dict = None

    @classmethod
    def parse(cls, body: dict, environment: str) -> "Hook": ...
