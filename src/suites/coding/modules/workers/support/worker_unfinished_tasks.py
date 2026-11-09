from core.base.driver.hook_event_name import HookEventName
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.modules.workers.support.worker_phases import WorkerPhases
from suites.coding.modules.workers.support.worker_round import WorkerRound
from suites.coding.modules.workers.support.worker_steps import WorkerSteps


class WorkerUnfinishedTasks:
    """The tasks a worker still has to do when it stops: none when it holds no task it can go on with, or when
    its tests are waiting, since those hand it its next task. While it holds a started task, the tasks it
    moved on from inside a phase count too, since they wait for the end of that phase. A worker has made
    progress when a task of it started or closed, or when it last used a tool, so only a worker that does
    nothing runs out of restarts."""

    def __init__(self, tasks: TaskQuery, processes: ProcessQuery, phases: WorkerPhases, hook_calls: HookCallQuery, steps: WorkerSteps) -> None:
        self.hook_calls, self.steps = hook_calls, steps
        self.tasks, self.processes, self.phases = tasks, processes, phases

    def rows(self, worker_id: int) -> tuple[Task, ...]:
        return self.round_rows(self.steps.round(worker_id))

    def round_rows(self, worker_round: WorkerRound) -> tuple[Task, ...]:
        if self.steps.is_delivered(worker_round) or (not worker_round.started and worker_round.following is None):
            return ()
        advanced = self.phases.advanced(worker_round.worker_id) if worker_round.started else ()
        return (*advanced, *worker_round.started, *self.tasks.queued_tasks(worker_round.worker_id))

    def last_progress_text(self, worker_id: int) -> str:
        tasks = self.tasks.filter(delegated_to=worker_id).all_rows()
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
