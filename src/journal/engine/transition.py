from dataclasses import dataclass

from journal.engine.agent_state import AgentState
from journal.engine.said import Said


@dataclass(frozen=True)
class Transition:
    """What a state answered an event with: where the agent is now, what to tell it, and whether the tool call goes ahead."""

    to: AgentState
    says: tuple[Said, ...] = ()
    refused: Said | None = None
