from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class PauseCause:
    """One cause of an agent's pause: who paused it, the agent itself or an ancestor, and from when."""

    actor_id: int
    paused_agent_id: int
    paused_at: datetime
