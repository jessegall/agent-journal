from enum import StrEnum


class AgentRole(StrEnum):
    """Whose chat a message is in: the environment's main agent's, a worker's the main agent sent, a subagent's an agent started in its own session, or the people's side thread beside the chat, which no agent reads."""

    MAIN = "main"
    WORKER = "worker"
    SUBAGENT = "subagent"
    PEOPLE = "people"
