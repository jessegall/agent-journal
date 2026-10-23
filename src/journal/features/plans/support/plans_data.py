from dataclasses import dataclass

from journal.features.plans.support.started_plan import StartedPlan


@dataclass(frozen=True)
class PlansData:
    """The plans feature's reading: the approved plans, the started plan when one is, and a plan in review whose reviewers are all back, with the tool use the agent was told at to put what they found into it."""

    approved: tuple[int, ...]
    started: StartedPlan | None
    review_plan: int
    review_tool_use: int
