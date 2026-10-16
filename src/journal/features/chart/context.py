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
    moves: list = field(default_factory=list)
    """The moves made in this event, each the node that made it and the state it left the agent in: one per event, a second is refused."""
    held: list = field(default_factory=list)
    """The node whose hold answers this event, the first to hold; empty while nothing holds."""
    stopped: list = field(default_factory=list)
    """The Stop here node that ended this event's walk, when one did: nothing after it ran, in its workflow or a later one."""
    unanswered: list = field(default_factory=list)
    read: dict = field(default_factory=dict)
    """What each count check read on this walk, by node: the value the check compared."""
    walked: list = field(default_factory=list)
    """The workflows walked, in order, by id."""
    """The holds that came after the first in this event: the first hold wins, the rest are recorded here and not answered."""
