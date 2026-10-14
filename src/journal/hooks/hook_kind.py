from enum import StrEnum


class HookKind(StrEnum):
    SESSION_START = "SessionStart"
    USER_PROMPT = "UserPromptSubmit"
    PRE_TOOL_USE = "PreToolUse"
    POST_TOOL_USE = "PostToolUse"
    PRE_COMPACT = "PreCompact"
    STOP = "Stop"
    SUBAGENT_START = "SubagentStart"
    SUBAGENT_STOP = "SubagentStop"
    SESSION_END = "SessionEnd"
