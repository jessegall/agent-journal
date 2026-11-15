from dataclasses import dataclass

from engine.agent_step.frame_codec import FrameCodec
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
        if row is None or not row.has_frames:
            return []
        return [OpenState(type(frame.state).__name__, frame.need_key.state_name,
                          tuple([f"{frame.need_key.subject.model} {frame.need_key.subject.row_id}"]) if frame.need_key.subject is not None else (),
                          frame.entered_at.isoformat()) for frame in FrameCodec.decoded(row.frames)]
