from dataclasses import dataclass

from journal.engine.base_state import BaseState
from journal.engine.nudge import Nudge
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.rows.worker_reported import WorkerReported
from journal.features.plans.states.plans_ready import PlansReady
from journal.features.tasks.support.tasks_data import TasksData


@dataclass(frozen=True)
class Orchestrating(PlansReady):
    """The orchestrator's mode state: it plans, hands the work to workers and reviews what comes back. A stop or a long quiet with open tasks is answered with the plans to check and the workers to dispatch, a worker's report with the same, and the task and plan states it pushes say delegate where the builder's say carry on."""

    name = "orchestrating"
    title = "Orchestrating"

    def plan_state(self, **fields) -> BaseState:
        from journal.features.workers.states.orchestrating_plan import OrchestratingPlan
        return OrchestratingPlan(**fields)

    def working_state(self, **fields) -> BaseState:
        from journal.features.workers.states.delegating import Delegating
        return Delegating(**fields)

    def stop_answer(self, tasks: TasksData, settings: Settings) -> Transition:
        return self.refuse(orchestrate(tasks)) if tasks.open_ids else self.none()

    def silent_nudges(self, tasks: TasksData) -> tuple[Nudge, ...]:
        return (orchestrate(tasks),) if tasks.open_ids else ()

    def on_worker_reported(self, event: WorkerReported, settings: Settings) -> Transition:
        from journal.features.tasks.feature import Tasks
        return self.none(*self.silent_nudges(event.data.part(Tasks)))


def orchestrate(tasks: TasksData) -> Nudge:
    from journal.features.workers.feature import Workers
    return Workers.ORCHESTRATE.create(count=len(tasks.open_ids), tasks=tasks.open_summary)
