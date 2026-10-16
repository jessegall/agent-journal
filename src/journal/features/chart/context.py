from dataclasses import dataclass, field

from journal.events.event import Event


@dataclass(frozen=True)
class Context:
    """Where a walk stands: the agent it is about, if any, the event that set it off, and whether a hook waits for the answer, which is when a hold or a blocked stop can be answered at all."""

    event: Event
    session: str = ""
    environment_id: int = 0
    provider: str = "claude"
    answers_hook: bool = False
    spoken: set = field(default_factory=set)
    """The lines this event already put in the terminal: a row event walks about every agent of the environment, and a walk about a second agent does not repeat a line the first one typed."""
