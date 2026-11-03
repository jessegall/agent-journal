from enum import StrEnum


class AgentLineState(StrEnum):
    """Where a line for an agent is: waiting for a hook, being typed by the server, delivered with a hook, or entered
    into the agent's terminal."""

    WAITING = "waiting"
    TYPING = "typing"
    DELIVERED = "delivered"
    ENTERED = "entered"
