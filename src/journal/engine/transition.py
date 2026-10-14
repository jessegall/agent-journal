from dataclasses import dataclass, field

from journal.engine.agent_state import AgentState


@dataclass(frozen=True)
class Transition:
    """What a state answered an event with: where the agent is now, what to tell it, and whether the tool call goes ahead."""

    to: AgentState
    nudges: tuple[str, ...] = ()
    refused: str = ""
