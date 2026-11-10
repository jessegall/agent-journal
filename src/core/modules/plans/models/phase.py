from dataclasses import dataclass

from engine.model.positioned import Positioned


@dataclass(frozen=True, kw_only=True)
class Phase(Positioned):
    """One step of a plan, at its place in the plan's order, with what is true when it is done."""

    model_name = "phase"
    cli_name = "phase"
    search_fields = ["title", "goal"]

    plan_id: int
    creator_id: int
    position: int
    title: str
    goal: str = ""
    checkpoint: bool = False
    test_command: str = ""
