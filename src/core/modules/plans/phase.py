from dataclasses import dataclass

from core.base.model.model import Model


@dataclass(frozen=True, kw_only=True)
class Phase(Model):
    """One step of a plan, at its place in the plan's order, with what is true when it is done."""

    model_name = "phase"
    cli_name = "phase"

    plan_id: int
    creator_id: int
    position: int
    title: str
    goal: str = ""
    checkpoint: bool = False
