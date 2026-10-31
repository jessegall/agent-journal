from enum import StrEnum


class AgentLineState(StrEnum):
    """Where a line for an agent is: waiting for a hook, delivered with one, or entered into the agent's terminal."""

    WAITING = "waiting"
    DELIVERED = "delivered"
    ENTERED = "entered"
