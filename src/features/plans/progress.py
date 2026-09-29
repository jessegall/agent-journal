from controllers.types import Todos
from features.plans.controller import ACTIVE, DONE, ENDED, Plans, RUNNING, WAITING
from features.work_tracking.auto import passes_checkpoints
from resources.base import SYSTEM
from resources.shapes import LEVELS
from features.plans.resource import PHASE
from features.plans.worker import start_phase_tickets


def running(record) -> list:
    return [p for p in Plans(record, actor=SYSTEM)._every() if p.status in RUNNING]


def current_phase(plan) -> dict | None:
    phases = plan.phases
    i = plan.current
    return phases[i - 1] if 0 < i <= len(phases) else None


def held(record, todo) -> bool:
    plans = Plans(record, actor=SYSTEM)._every()
    for plan in plans:
        if plan.status in ENDED or not any(todo.n in phase[PHASE.todos] for phase in plan.phases):
            continue
        phase = current_phase(plan)
        return plan.status != ACTIVE or phase is None or todo.n not in phase[PHASE.todos]
    return any(p.status == ACTIVE for p in plans) and int(todo.priority or LEVELS["default"]) < LEVELS["critical"]


def status_after(last: bool, waits: bool) -> str:
    if last:
        return DONE
    if waits:
        return WAITING
    return ACTIVE


def closed(rows, n: int) -> bool:
    return not rows._exists(int(n)) or bool(rows.load(n).completed)


PHASE_ROWS: dict = {}


def phase_rows(record, phase: dict, actor: str = SYSTEM) -> list:
    todos = Todos(record, actor=actor)
    held = [todos.load(n) for n in phase[PHASE.todos]]
    return held + [row for key, rows in PHASE_ROWS.items() for row in map(rows(record, actor=actor).load, phase.get(key, []))]


def phase_complete(record, phase: dict) -> bool:
    todos = Todos(record, actor=SYSTEM)
    members = {key: rows(record, actor=SYSTEM) for key, rows in PHASE_ROWS.items()}
    return all(closed(todos, n) for n in phase[PHASE.todos]) and all(closed(rows, n) for key, rows in members.items() for n in phase.get(key, []))


def first_open_phase(record, plan) -> int:
    return next((p for p, phase in enumerate(plan.phases, 1) if not phase_complete(record, phase)), 0)


def step(record, plan) -> bool:
    phase = current_phase(plan)
    if plan.status != ACTIVE or phase is None or not phase_complete(record, phase):
        return False
    i = plan.current
    last = i == len(plan.phases)
    waits = bool(phase[PHASE.checkpoint]) and not passes_checkpoints(record)
    plan.status = status_after(last, waits)
    plan.current = i if last or waits else i + 1
    plans = Plans(record, actor=SYSTEM)
    plans.save(plan, "updated", phase=i, complete=True, status=plan.status, passed=bool(phase[PHASE.checkpoint]) and not waits)
    if last:
        plans.complete(plan.n, how="every row in every phase is done")
    elif not waits:
        start_phase_tickets(record, plan)
    return not (last or waits)


def catch_up(record) -> None:
    for plan in running(record):
        while step(record, plan):
            pass
