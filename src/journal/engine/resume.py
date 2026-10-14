from dataclasses import dataclass

from journal.engine.agent_state import AgentState


@dataclass(frozen=True)
class Resume(AgentState):
    """Not a state the agent is ever in: what a Paused state answers with to go back, which the machine resolves through the catalogue."""

    name = "resume"
    state: str = "idle"
    data: dict = None
