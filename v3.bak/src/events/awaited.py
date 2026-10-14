"""What the awaited feature recognises: a wait whose every helper and background run is back."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class WaitEnded(Fact):
    """A work's wait ended, with what each thing it waited on came to."""

    work: int
    awaiting: str
    results: str
    count: int
