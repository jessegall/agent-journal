from pathlib import Path

from controllers.types import environment_records
from features.plans.controller import Plans
from features.plans.resource import DONE, ENDED
from resources.base import SYSTEM


def run(root: Path) -> list[str]:
    """Marks every finished plan that kept a running or parked status as done."""
    lines = []
    for record in environment_records(Path(root)):
        plans = Plans(record, actor=SYSTEM)
        for plan in [plan for plan in plans.rows.every() if plan.completed and plan.status not in ENDED]:
            plans.update(plan.n, status=DONE)
            lines.append(f"plan {plan.n} in {record.env} is finished, so it is done and no longer {plan.status}")
    return lines
