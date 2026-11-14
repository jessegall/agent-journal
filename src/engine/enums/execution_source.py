from enum import StrEnum


class ExecutionSource(StrEnum):
    """Where an execution comes from, the first thing its class is chosen by."""

    HOOK = "hook"
    COMMAND = "command"
    VIEWER_REQUEST = "viewer request"
    UNQUEUED_READ = "unqueued read"
    TICK_HANDLER = "tick handler"
    LISTENER_EVENT = "listener event"
    RELEASE_WORK = "release work"
    SHELL_LINE = "shell line"
    JOURNAL_RUN = "journal run"
    PLUGIN_PROGRAM = "plugin program"
    GRAPHIFY = "graphify"
    FOLLOW_UP = "follow-up"
