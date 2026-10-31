from enum import StrEnum


class AgentLineState(StrEnum):
    """Where a line for an agent is: waiting for a hook, given with one, or typed into the agent's terminal."""

    WAITING = "waiting"
    GIVEN = "given"
    TYPED = "typed"
