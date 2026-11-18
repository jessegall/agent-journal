from dataclasses import dataclass

from journal.features.workers.support.worker_news import WorkerNews

from journal.features.workers.support.orchestrator_task_assigner import OrchestratorTaskAssigner
from journal.engine.base_state import BaseState
from journal.engine.nudge import Nudge
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.feature_data import FeatureData
from journal.events.rows.worker_reported import WorkerReported
from journal.features.plans.states.plans_ready import PlansReady
from journal.features.tasks.support.tasks_data import TasksData
from journal.features.tasks.tasks_part import TasksPart
from journal.features.tasks.tasks_nudges import TasksNudges
from journal.features.workers.states.delegating import Delegating
from journal.features.workers.states.orchestrating_plan import OrchestratingPlan
from journal.features.workers.support.orchestration import delegation_lines
from journal.features.workers.workers_nudges import WorkersNudges


@dataclass(frozen=True)
class Orchestrating(PlansReady):
    """The orchestrator's mode state: it plans, gives the work to workers and reviews what comes back. A stop asks first about the blocked tasks the agent can move, then names the tasks to dispatch; a long idle time with open tasks is answered with the same, a worker's report with the same, unless the worker news gathers it, and the task and plan states it pushes say delegate where the builder's say continue."""

    name = "orchestrating"
    assigner = OrchestratorTaskAssigner
    title = "Orchestrating"

    @classmethod
    def delegates_work(cls) -> bool:
        return True

    def mode_lines(self) -> tuple[Nudge, ...]:
            return (WorkersNudges.ORCHESTRATOR_MODE.create(),)

    def plan_state(self, **fields) -> BaseState:
        return OrchestratingPlan(**fields)

    def working_state(self, **fields) -> BaseState:
        return Delegating(**fields)

    def open_lines(self, data: FeatureData, settings: Settings) -> tuple[Nudge, ...]:
        return (*blocked_review(data.part(TasksPart)), *delegation_lines(data))

    def silent_nudges(self, data: FeatureData) -> tuple[Nudge, ...]:
        return (*delegation_lines(data), *blocked_check(data.part(TasksPart)))

    def on_worker_reported(self, event: WorkerReported, settings: Settings) -> Transition:
        if WorkerNews.is_gathered(settings):
            return self.none()
        return self.none(*self.silent_nudges(event.data))


def blocked_check(tasks: TasksData) -> tuple[Nudge, ...]:
    queue = tuple(n for n in tasks.blocked if n not in tasks.person_waits)
    return (WorkersNudges.BLOCKED_CHECK.create(count=len(queue), tasks=numbers(queue)),) if queue else ()


def blocked_review(tasks: TasksData) -> tuple[Nudge, ...]:
    reviewable = tuple(n for n in tasks.blocked if n not in tasks.person_waits)
    return (TasksNudges.BLOCKED_REVIEW.create(tasks=numbers(reviewable)),) if reviewable else ()


def numbers(ids: tuple[int, ...]) -> str:
    return ", ".join(str(n) for n in ids)
