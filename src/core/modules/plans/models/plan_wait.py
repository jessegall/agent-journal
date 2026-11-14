from dataclasses import dataclass

from engine.model.model import Model
from engine.time.timestamp import Timestamp


@dataclass(frozen=True, kw_only=True)
class PlanWait(Model):
    """A plan another plan waits on: the blocked plan opens once every wait of it has ended."""

    model_name = "plan_wait"
    cli_name = "plan-wait"

    plan_id: int
    creator_id: int
    blocker_id: int
    ended_at: Timestamp | None = None
