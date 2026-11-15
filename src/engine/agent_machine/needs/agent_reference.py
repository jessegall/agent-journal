from dataclasses import dataclass


@dataclass(frozen=True)
class AgentReference:
    """The agent a step is for, as need, fact and policy sources read it: its row, its parent, its environment and its type."""

    agent_id: int
    parent_id: int | None
    environment_id: int
    agent_type: str
