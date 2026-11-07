from enum import StrEnum


class AgentLineState(StrEnum):
    """Where a line for an agent is: waiting for a hook, being typed by the server, delivered with a hook,
    entered into the agent's terminal, or hidden because another agent caused it and nothing declared that
    the line may be sent."""

    WAITING = "waiting"
    TYPING = "typing"
    DELIVERED = "delivered"
    ENTERED = "entered"
    HIDDEN = "hidden"
