from enum import StrEnum


class AgentRole(StrEnum):
    """Whether an agent is the environment's main agent, a worker the main agent sent, or a subagent an agent started in its own session."""

    MAIN = "main"
    WORKER = "worker"
    SUBAGENT = "subagent"
