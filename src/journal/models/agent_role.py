from enum import StrEnum


class AgentRole(StrEnum):
    """Whether an agent is the environment's main agent or a worker the main agent sent."""

    MAIN = "main"
    WORKER = "worker"
