from dataclasses import dataclass

from journal.models.model import Model


@dataclass(frozen=True)
class Timing(Model):
    """One request's time to answer, where the journal develops itself: the method (HOOK, GET or POST), the route or the command, the milliseconds and the moment."""

    method: str = ""
    route: str = ""
    ms: int = 0
    time: float = 0.0
