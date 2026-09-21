from controllers.types import Todos
from features.plans.controller import ACTIVE, DONE, Plans, WAITING
from features.work.auto import automatic
from resources.base import SYSTEM
from resources.shapes import LEVELS
from features.plans.resource import PHASE


def running(record) -> list:
    return [p for p in Plans(record, actor=SYSTEM)._every() if p.status in (ACTIVE, WAITING)]


def current_phase(plan) -> dict | None:
    phases = plan.phases
    i = plan.current
    return phases[i - 1] if 0 < i <= len(phases) else None


def held(record, todo) -> bool:
    plans = Plans(record, actor=SYSTEM)._every()
    for plan in plans:
        if todo.ref not in plan.refs:
            continue
        phase = current_phase(plan)
        return plan.status != ACTIVE or phase is None or todo.n not in phase[PHASE.todos]
    return any(p.status == ACTIVE for p in plans) and int(todo.priority or LEVELS["default"]) < LEVELS["critical"]


def phase_complete(record, phase: dict) -> bool:
    todos = Todos(record, actor=SYSTEM)
    return all(todos.load(n).completed for n in phase[PHASE.todos])


def step(record, plan) -> bool:
    phase = current_phase(plan)
    if plan.status != ACTIVE or phase is None or not phase_complete(record, phase):
        return False
    i = plan.current
    last = i == len(plan.phases)
    waits = bool(phase[PHASE.checkpoint]) and not automatic(record)
    plan.status = DONE if last else WAITING if waits else ACTIVE
    plan.current = i if last or waits else i + 1
    Plans(record, actor=SYSTEM).save(plan, "updated", phase=i, complete=True, status=plan.status, passed=bool(phase[PHASE.checkpoint]) and not waits)
    return not (last or waits)


def catch_up(record) -> None:
    for plan in running(record):
        while step(record, plan):
            pass
