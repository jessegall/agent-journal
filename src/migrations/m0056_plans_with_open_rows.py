from pathlib import Path

from controllers.types import environment_records
from features.plans.controller import ACTIVE, DONE, Plans
from features.plans.progress import first_open_phase
from resources.base import SYSTEM


def run(root: Path) -> list[str]:
    reopened = []
    for record in environment_records(Path(root)):
        plans = Plans(record, actor=SYSTEM)
        for plan in [p for p in plans._every() if p.status == DONE and not p.deleted]:
            phase = first_open_phase(record, plan)
            if not phase:
                continue
            if plan.completed:
                plan = plans.reopen(plan.n, why=f"phase {phase} still has open rows")
            plan.status, plan.current = ACTIVE, phase
            plans.save(plan, "updated", phase=phase, status=ACTIVE)
            reopened.append(f"{record.env} {plan.ref}")
    return reopened
