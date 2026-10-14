from enum import StrEnum


class HookKind(StrEnum):
    SESSION_START = "SessionStart"
    USER_PROMPT = "UserPromptSubmit"
    PRE_TOOL_USE = "PreToolUse"
    POST_TOOL_USE = "PostToolUse"
    PRE_COMPACT = "PreCompact"
    STOP = "Stop"
    SESSION_END = "SessionEnd"
