from dataclasses import dataclass

from journal.events.event import Event


@dataclass(frozen=True)
class Context:
    """Where a walk stands: the agent it is about, if any, the event that set it off, and whether a hook waits for the answer, which is when a hold or a blocked stop can be answered at all."""

    event: Event
    session: str = ""
    environment_id: int = 0
    provider: str = "claude"
    answers_hook: bool = False
    voiced: bool = True
    """Whether this walk may speak to the environment's terminal: a row event walks about every agent of the environment, and only the first walk speaks, so a line is typed once while every agent's wait is reached."""
