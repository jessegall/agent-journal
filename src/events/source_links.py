"""What source links recognises: a plan, doc or report the agent made soon after reading sources it did not cite."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class SourceUncited(Fact):
    """A plan, doc or report cites none of the reports and docs the agent read lately; these are the ones to link."""

    type: str
    n: int
    read: str
