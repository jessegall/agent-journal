from dataclasses import asdict, dataclass

from journal.models.subagent import Subagent
from journal.models.subagent_state import SubagentState


@dataclass(frozen=True)
class SubagentCard:
    """What a subagent's card in the chat carries: who dispatched it, of which type and model, its own session, how it stood at that card and why it failed."""

    session: str
    agent: int
    agent_type: str
    model: str | None
    subagent: str
    state: str
    reason: str

    @classmethod
    def built(cls, session: str, agent: int, row: Subagent, state: SubagentState, reason: str) -> "SubagentCard":
        return cls(session, agent, row.agent_type, row.model, row.session, state.value, reason)

    def as_data(self) -> dict:
        return {"kind": "subagent", **asdict(self)}
