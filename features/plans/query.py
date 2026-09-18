from controllers.types import ACTIVE, Plans, WAITING
from resources.base import SYSTEM
from resources.types import PHASE


def running(record) -> list:
    return [p for p in Plans(record, actor=SYSTEM).all() if p.status in (ACTIVE, WAITING)]


def current_phase(plan) -> dict | None:
    phases = plan.phases
    i = plan.current
    return phases[i - 1] if 0 < i <= len(phases) else None


def held(record, todo) -> bool:
    for plan in Plans(record, actor=SYSTEM).all():
        if todo.ref not in plan.refs:
            continue
        phase = current_phase(plan)
        return plan.status != ACTIVE or phase is None or todo.n not in phase[PHASE.todos]
    return False
