from controllers.types import ACTIVE, DONE, Plans, Todos, WAITING
from features.auto.feature import Auto
from features.base import Feature, on
from features.plans.query import current_phase, running
from resources.base import SYSTEM
from resources.types import PHASE


class PlansFeature(Feature):
    name = "plans"
    title_ = "Plans"
    abstract_ = "A plan advances as its rows close: a phase completes, a checkpoint waits, the last phase ends it"
    help_ = "Only the user activates a plan and continues it past a checkpoint; with the auto feature on, checkpoints are passed without waiting."

    def phase_complete(self, record, phase: dict) -> bool:
        todos = Todos(record, actor=SYSTEM)
        return all(todos.load(n).completed for n in phase[PHASE.todos])

    @on("agent.updated")
    def pass_checkpoints(self, event, record) -> None:
        if not Auto.on_for(record):
            return
        plans = Plans(record, actor=SYSTEM)
        for plan in plans.all():
            if plan.status == WAITING:
                plans.resume(plan.n)

    @on("todo.completed")
    def advance(self, event, record) -> None:
        plans = Plans(record, actor=SYSTEM)
        for plan in running(record):
            phase = current_phase(plan)
            if event.ref not in plan.refs or plan.status != ACTIVE or phase is None or not self.phase_complete(record, phase):
                continue
            i = plan.current
            last = i == len(plan.phases)
            waits = bool(phase[PHASE.checkpoint]) and not Auto.on_for(record)
            plan.status = DONE if last else WAITING if waits else ACTIVE
            plan.current = i if last or waits else i + 1
            plans.save(plan, "updated", phase=i, complete=True, status=plan.status, passed=bool(phase[PHASE.checkpoint]) and not waits)
