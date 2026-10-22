from enum import StrEnum


class CallerKind(StrEnum):
    """Which kind of agent, or person, runs a command."""

    MAIN_AGENT = "main agent"
    WORKER = "worker"
    SUBAGENT = "subagent"
    USER = "user"
    PLUGIN = "plugin"
