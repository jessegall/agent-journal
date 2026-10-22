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

    def mode_lines(self) -> tuple[Nudge, ...]:
        from journal.features.workers.feature import Workers
        return (Workers.ORCHESTRATOR_MODE.create(),)

    def plan_state(self, **fields) -> BaseState:
        from journal.features.workers.states.orchestrating_plan import OrchestratingPlan
        return OrchestratingPlan(**fields)

    def working_state(self, **fields) -> BaseState:
        from journal.features.workers.states.delegating import Delegating
        return Delegating(**fields)

    def open_lines(self, data: FeatureData, settings: Settings) -> tuple[Nudge, ...]:
        from journal.features.tasks.feature import Tasks
        tasks = data.part(Tasks)
        return (orchestrate(tasks),) if settings.value(Tasks.AUTO) and tasks.open_ids else ()

    def silent_nudges(self, tasks: TasksData) -> tuple[Nudge, ...]:
        return (*open_lines(tasks), *blocked_check(tasks))

    def on_worker_reported(self, event: WorkerReported, settings: Settings) -> Transition:
        from journal.features.tasks.feature import Tasks
        return self.none(*self.silent_nudges(event.data.part(Tasks)))


def orchestrate(tasks: TasksData) -> Nudge:
    from journal.features.workers.feature import Workers
    return Workers.ORCHESTRATE.create(count=len(tasks.open_ids), tasks=tasks.open_summary)


def blocked_check(tasks: TasksData) -> tuple[Nudge, ...]:
    from journal.features.workers.feature import Workers
    queue = (*tasks.suspended, *tasks.blocked)
    return (Workers.BLOCKED_CHECK.create(count=len(queue), tasks=numbers(queue)),) if queue else ()


def open_lines(tasks: TasksData) -> tuple[Nudge, ...]:
    return (orchestrate(tasks),) if tasks.open_ids else ()


def numbers(ids: tuple[int, ...]) -> str:
    return ", ".join(str(n) for n in ids)
