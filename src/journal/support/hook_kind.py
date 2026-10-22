from enum import StrEnum


class HookKind(StrEnum):
    SESSION_START = "SessionStart"
    USER_PROMPT = "UserPromptSubmit"
    PRE_TOOL_USE = "PreToolUse"
    POST_TOOL_USE = "PostToolUse"
    POST_TOOL_USE_FAILURE = "PostToolUseFailure"
    PRE_COMPACT = "PreCompact"
    STOP = "Stop"
    SUBAGENT_START = "SubagentStart"
    SUBAGENT_STOP = "SubagentStop"
    MESSAGE_DISPLAY = "MessageDisplay"
    SESSION_END = "SessionEnd"
