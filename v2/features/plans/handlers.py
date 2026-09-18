from v2.controllers.types import ACTIVE, CONTROLLERS, DONE, WAITING
from v2.features import on
from v2.features.plans.query import current_phase, running
from v2.resources.base import SYSTEM


def phase_complete(record, phase: dict) -> bool:
    todos = CONTROLLERS["todo"](record, actor=SYSTEM)
    return all(todos.load(n).completed for n in phase["todos"])


def advance(event, record) -> None:
    plans = CONTROLLERS["plan"](record, actor=SYSTEM)
    for plan in running(record):
        if event.ref not in plan.refs or plan.data["status"] != ACTIVE:
            continue
        phase = current_phase(plan)
        if phase is None or not phase_complete(record, phase):
            continue
        i = plan.data["current"]
        last = i == len(plan.data["phases"])
        plan.data["status"] = DONE if last else WAITING if phase["checkpoint"] else ACTIVE
        plan.data["current"] = i if last or phase["checkpoint"] else i + 1
        plans.save(plan, "updated", phase=i, complete=True, status=plan.data["status"])


def register() -> None:
    on("plans", "todo.completed", advance)
