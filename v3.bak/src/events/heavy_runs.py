"""What heavy runs recognises: a test run asked for while another one is going, and one that starts clear."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class HeavyRunHeld(Fact):
    """A heavy run was asked for while another was going in the project, so it joins the queue."""

    agent: int
    command: str
    ahead: str
    where: str
    at: float


@dataclass(frozen=True, kw_only=True)
class HeavyRunStarted(Fact):
    """A heavy run was asked for with none going, so this environment's place in the queue is given up."""

    agent: int
