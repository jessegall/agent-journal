from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_phases import WorkerPhases
from suites.coding.modules.workers.support.worker_next_task import WorkerNextTask


class WorkerUnfinishedTasks:
    """The tasks a worker still has to do when it stops: none when it holds no task it can go on with, or
    when its tests are waiting, since those hand it its next task. While it holds a started task, the tasks it
    moved on from inside a phase count too, since they wait for the end of that phase."""

    def __init__(self, tasks: TaskQuery, worktrees: WorktreeQuery, proofs: ProofQuery, processes: ProcessQuery, phases: WorkerPhases, next_task: WorkerNextTask) -> None:
        self.next_task = next_task
        self.tasks, self.worktrees, self.proofs, self.processes, self.phases = tasks, worktrees, proofs, processes, phases

    def rows(self, worker_id: int) -> tuple[Task, ...]:
        started = self.tasks.started_tasks(worker_id)
        queued = self.next_task.following(worker_id)
        worktree = self.worktrees.worker_worktree(worker_id)
        if not started and (queued is None or (worktree is not None and self.proofs.tests_waiting(worktree.id))):
            return ()
        advanced = self.phases.advanced(worker_id) if started else ()
        return (*advanced, *started, *self.tasks.queued_tasks(worker_id))

    def last_progress_text(self, worker_id: int) -> str:
        tasks = self.tasks.filter(delegated_to=worker_id).all_rows()
        stamps = [stamp.text for task in tasks for stamp in (task.started_at, task.closed_at) if stamp]
        return max(stamps, default="")

    def has_running_process(self, worker_id: int) -> bool:
        return self.processes.agent(worker_id).running().exists()

    @staticmethod
    def names(tasks: tuple[Task, ...]) -> str:
        return ", ".join(f"task:{task.id}" for task in tasks)
