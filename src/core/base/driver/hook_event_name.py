from enum import StrEnum


class HookEventName(StrEnum):
    """The hook events of every agent program under one name each, and the tick the server sends itself; a
    subagent's start and stop are a session start and a stop with the subagent named."""

    PRE_TOOL_USE = "pre_tool_use"
    POST_TOOL_USE = "post_tool_use"
    POST_TOOL_USE_FAILURE = "post_tool_use_failure"
    PROMPT = "prompt"
    STOP = "stop"
    STOP_FAILURE = "stop_failure"
    SESSION_START = "session_start"
    SESSION_END = "session_end"
    COMPACT = "compact"
    MESSAGE_DISPLAY = "message_display"
    TICK = "tick"
