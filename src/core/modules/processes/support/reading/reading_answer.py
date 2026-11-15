from dataclasses import dataclass

from engine.driver.nudge import Nudge


@dataclass(frozen=True)
class ReadingAnswer:
    """What the reading enforcer says to a shell line: the refusal of its next start, if any, and the lines that
    teach the agent to read its runs, or that come with the refusal."""

    refusal: Nudge | None = None
    nudges: tuple[Nudge, ...] = ()
