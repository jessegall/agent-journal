from typing import TypedDict


class PlanWorkingTaskJsonRecord(TypedDict):
    """A started task of a plan card, as PlanBoard.json lists it."""

    id: int
    title: str
