from dataclasses import dataclass

from journal.features.plans.support.started_plan import StartedPlan


@dataclass(frozen=True)
class PlansStanding:
    """The plans feature's reading: the approved plans, and the started plan when one is."""

    approved: tuple[int, ...]
    started: StartedPlan | None
