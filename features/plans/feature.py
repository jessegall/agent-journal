from controllers.types import ACTIVE, DONE, Plans, Todos, WAITING
from features.base import Feature, on
from features.plans.query import current_phase, running
from resources.base import SYSTEM
from resources.types import PHASE


class PlansFeature(Feature):
    name = "plans"
    title_ = "Plans"
    abstract_ = "A plan advances as its rows close: a phase completes, a checkpoint waits, the last phase ends it"
    help_ = "Only the user activates a plan and continues it past a checkpoint."

    def phase_complete(self, record, phase: dict) -> bool:
        todos = Todos(record, actor=SYSTEM)
        return all(todos.load(n).completed for n in phase[PHASE.todos])

    @on("todo.completed")
    def advance(self, event, record) -> None:
        plans = Plans(record, actor=SYSTEM)
        for plan in running(record):
            phase = current_phase(plan)
            if event.ref not in plan.refs or plan.status != ACTIVE or phase is None or not self.phase_complete(record, phase):
                continue
            i = plan.current
            last = i == len(plan.phases)
            plan.status = DONE if last else WAITING if phase[PHASE.checkpoint] else ACTIVE
            plan.current = i if last or phase[PHASE.checkpoint] else i + 1
            plans.save(plan, "updated", phase=i, complete=True, status=plan.status)
