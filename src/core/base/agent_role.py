from enum import StrEnum


class AgentRole(StrEnum):
    """What an agent session is there for: the main agent of an environment, or a helper it started."""

    MAIN = "main"
    WORKER = "worker"
    SUBAGENT = "subagent"
    REVIEWER = "reviewer"
    VERIFIER = "verifier"
