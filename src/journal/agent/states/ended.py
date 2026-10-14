from dataclasses import dataclass

from journal.agent.agent_state import AgentState


@dataclass(frozen=True)
class Ended(AgentState):
    """The session is over. Nothing is allowed and nothing is said."""

    name = "ended"
