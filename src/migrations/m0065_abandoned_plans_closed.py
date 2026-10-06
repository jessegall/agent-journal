from pathlib import Path

from controllers.types import environment_records
from features.plans.controller import Plans
from features.plans.resource import ABANDONED
from resources.base import SYSTEM


def run(root: Path) -> list[str]:
    closed = []
    for record in environment_records(Path(root)):
        plans = Plans(record, actor=SYSTEM)
        for plan in [plan for plan in plans.all() if plan.status == ABANDONED]:
            plans.complete(plan.n, how="abandoned")
            closed.append(f"{record.env}: plan {plan.n} was abandoned, so it is closed")
    return closed
