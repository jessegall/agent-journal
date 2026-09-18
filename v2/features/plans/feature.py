from v2.controllers.types import ACTIVE, CONTROLLERS, DONE, WAITING
from v2.features.base import Feature, on
from v2.features.plans.query import current_phase, running
from v2.resources.base import SYSTEM


class Plans(Feature):
    name = "plans"
    title_ = "Plans"
    abstract_ = "A plan advances as its rows close: a phase completes, a checkpoint waits, the last phase ends it"
    help_ = "Only the user activates a plan and continues it past a checkpoint."

    def phase_complete(self, record, phase: dict) -> bool:
        todos = CONTROLLERS["todo"](record, actor=SYSTEM)
        return all(todos.load(n).completed for n in phase["todos"])

    @on("todo.completed")
    def advance(self, event, record) -> None:
        plans = CONTROLLERS["plan"](record, actor=SYSTEM)
        for plan in running(record):
            phase = current_phase(plan)
            if event.ref not in plan.refs or plan.data["status"] != ACTIVE or phase is None or not self.phase_complete(record, phase):
                continue
            i = plan.data["current"]
            last = i == len(plan.data["phases"])
            plan.data["status"] = DONE if last else WAITING if phase["checkpoint"] else ACTIVE
            plan.data["current"] = i if last or phase["checkpoint"] else i + 1
            plans.save(plan, "updated", phase=i, complete=True, status=plan.data["status"])
