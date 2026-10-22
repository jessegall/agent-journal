from dataclasses import dataclass

from journal.engine.nudge import Nudge


@dataclass(frozen=True)
class Block:
    """The nudge that holds an event or refuses a push: the agent hears why and nothing moves."""

    nudge: Nudge
