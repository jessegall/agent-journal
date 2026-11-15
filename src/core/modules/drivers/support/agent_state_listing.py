from dataclasses import dataclass

from engine.agent_step.stack_codec import StackCodec
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_stack import AgentStack


@dataclass(frozen=True)
class OpenState:
    """One frame of an agent's stack, for a screen: its state type, its state's name, the row its need is about,
    and since when."""

    state: str
    name: str
    rows: tuple[str, ...]
    since: str


class AgentStateListing:
    """The frames of an agent's stack from the bottom, as a screen lists them."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def open_states(self, agent: Agent) -> list[OpenState]:
        row = self.queries.query(AgentStack).filter(session_agent_id=agent.id).first()
        if row is None or not row.has_stacked_states:
            return []
        return [OpenState(type(stacked_state.state).__name__, stacked_state.state_key.state_name,
                          tuple([f"{stacked_state.state_key.subject.model} {stacked_state.state_key.subject.row_id}"]) if stacked_state.state_key.subject is not None else (),
                          stacked_state.entered_at.isoformat()) for stacked_state in StackCodec.decoded(row.stacked_states)]
