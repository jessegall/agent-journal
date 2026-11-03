from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery


class WorkerUnfinishedTasks:
    """The tasks a worker still has to do when it stops: none when it holds no task it can go on with, or when
    its tests are waiting, since those hand it its next task."""

    def __init__(self, tasks: TaskQuery, worktrees: WorktreeQuery, proofs: ProofQuery, processes: ProcessQuery) -> None:
        self.tasks, self.worktrees, self.proofs, self.processes = tasks, worktrees, proofs, processes

    def rows(self, worker_id: int) -> tuple[Task, ...]:
        started = tuple(self.tasks.holder(worker_id).started().all_rows())
        queued = self.tasks.next_delegated(worker_id)
        worktree = self.worktrees.worker_worktree(worker_id)
        if not started and (queued is None or (worktree is not None and self.proofs.tests_waiting(worktree.id))):
            return ()
        return (*started, *self.tasks.filter(delegated_to=worker_id, state=TaskState.OPEN).all_rows())

    def has_run_going(self, worker_id: int) -> bool:
        return self.processes.agent(worker_id).running().exists()

    @staticmethod
    def names(tasks: tuple[Task, ...]) -> str:
        return ", ".join(f"task:{task.id}" for task in tasks)
