from core.modules.tasks.queries.task_query import TASK_PAGE_ROWS
from core.modules.tasks.models.enums.task_state import TaskState
from engine.enums.hook_event_name import HookEventName
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery
from core.modules.plans.support.task_plans import TaskPlans
from engine.database.kept_rows import KeptRows
from engine.query.queries import Queries
from suites.coding.modules.workers.support.worker_round import WorkerRound
from suites.coding.modules.workers.support.worker_steps import WorkerSteps


class WorkerUnfinishedTasks:
    """The tasks a worker still has to do when it stops: none when it holds no task it can go on with, or when
    its tests are waiting. Its committed tasks are those in testing in a started plan, which wait for a
    checkpoint. A worker has made
    progress when a task of it started or closed, or when it last used a tool, so only a worker that does
    nothing runs out of restarts."""

    def __init__(self, tasks: TaskQuery, processes: ProcessQuery, plans: TaskPlans, hook_calls: HookCallQuery, steps: WorkerSteps, queries: Queries, kept: KeptRows) -> None:
        self.hook_calls, self.steps = hook_calls, steps
        self.tasks, self.processes, self.plans, self.queries, self.kept = tasks, processes, plans, queries, kept

    def rows(self, worker_id: int) -> tuple[Task, ...]:
        return self.round_rows(self.steps.round(worker_id))

    def round_rows(self, worker_round: WorkerRound) -> tuple[Task, ...]:
        if self.steps.is_delivered(worker_round) or (not worker_round.started and worker_round.following is None):
            return ()
        return (*worker_round.started, *self.tasks.assigned(worker_round.worker_id))

    def committed(self, worker_id: int) -> tuple[Task, ...]:
        testing = self.kept.scoped_current(lambda: tuple(self.tasks.assignee_tasks(worker_id).filter(state=TaskState.TESTING).oldest().all_rows(TASK_PAGE_ROWS)),
                                           name=f"workers.testing_tasks:{worker_id}")
        self.plans.prepare([task.id for task in testing])
        return tuple(task for task in testing if self.plans.is_started_plan(task.id))

    def last_progress_text(self, worker_id: int) -> str:
        tasks = self.tasks.assignee_tasks(worker_id).oldest().all_rows(TASK_PAGE_ROWS)
        stamps = [stamp.text for task in tasks for stamp in (task.started_at, task.closed_at) if stamp]
        last_tool_use = self.hook_calls.agent(worker_id).filter(hook=HookEventName.PRE_TOOL_USE).newest().first()
        if last_tool_use is not None:
            stamps.append(last_tool_use.creation_timestamp().text)
        return max(stamps, default="")

    def has_running_process(self, worker_id: int) -> bool:
        return self.processes.agent(worker_id).running().exists()

    @staticmethod
    def names(tasks: tuple[Task, ...]) -> str:
        return ", ".join(f"task:{task.id}" for task in tasks)
