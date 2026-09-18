from controllers.types import ACTIVE, Plans, WAITING
from resources.base import SYSTEM


def running(record) -> list:
    return [p for p in Plans(record, actor=SYSTEM).all() if p.data.get("status") in (ACTIVE, WAITING)]


def current_phase(plan) -> dict | None:
    phases = plan.data["phases"]
    i = plan.data.get("current", 1)
    return phases[i - 1] if 0 < i <= len(phases) else None


def held(record, todo) -> bool:
    for plan in Plans(record, actor=SYSTEM).all():
        if todo.ref not in plan.refs:
            continue
        phase = current_phase(plan)
        return plan.data.get("status") != ACTIVE or phase is None or todo.n not in phase["todos"]
    return False
