from features.plans.controller import ACTIVE, Plans, WAITING
from resources.base import SYSTEM
from resources.shapes import LEVELS
from features.plans.resource import PHASE


def running(record) -> list:
    return [p for p in Plans(record, actor=SYSTEM).all() if p.status in (ACTIVE, WAITING)]


def current_phase(plan) -> dict | None:
    phases = plan.phases
    i = plan.current
    return phases[i - 1] if 0 < i <= len(phases) else None


def held(record, todo) -> bool:
    plans = Plans(record, actor=SYSTEM).all()
    for plan in plans:
        if todo.ref not in plan.refs:
            continue
        phase = current_phase(plan)
        return plan.status != ACTIVE or phase is None or todo.n not in phase[PHASE.todos]
    return any(p.status == ACTIVE for p in plans) and int(todo.priority or LEVELS["default"]) < LEVELS["critical"]
