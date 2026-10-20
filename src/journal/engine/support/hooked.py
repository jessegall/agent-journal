from dataclasses import dataclass

from journal.engine.nudge import Nudge
from journal.engine.support.held import Held
from journal.engine.support.stack import Stack


@dataclass(frozen=True)
class Hooked:
    """The stack once the lifecycle hooks ran on a push or a pop: as it stands, the nudges the hooks said, and the hold when on_push refused the push."""

    stack: Stack
    nudges: tuple[Nudge, ...] = ()
    held: Held | None = None
    refused: str = ""
