from dataclasses import dataclass, field

from journal.engine.agent_state import AgentState
from journal.events.event import Event


@dataclass(frozen=True)
class Context:
    """Where a walk stands: the agent it is about, if any, the event that set it off, and whether a hook waits for the answer, which is when a hold or a blocked stop can be answered at all."""

    event: Event
    session: str = ""
    environment_id: int = 0
    provider: str = "claude"
    answers_hook: bool = False
    state: AgentState | None = None
    """The agent's state as the walk found it, read once after the machine and the engine's holds have answered the event, so every check and filler reads the same state; None when the walk is about no agent."""
    spoken: set = field(default_factory=set)
    """The lines this event already put in the terminal: a row event walks about every agent of the environment, and a walk about a second agent does not repeat a line the first one typed."""
