from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_log import TaskLog
from suites.coding.modules.workers.support.worker_review import WorkerReview
from suites.coding.modules.workers.support.worker_test_failures import WorkerTestFailures

REVIEWED_STATES = (TaskState.TESTING, TaskState.COMPLETED)


class WorkerLogLines:
    """Reads what the main agent reviews of a worker before it merges."""

    def __init__(self, queries: Queries, failures: WorkerTestFailures) -> None:
        self.queries, self.failures = queries, failures

    def review(self, worker_id: int) -> WorkerReview:
        tasks = tuple(self.queries.query(Task).filter(delegated_to=worker_id).matching(Among("state", REVIEWED_STATES)).oldest().all_rows())
        task_ids = [task.id for task in tasks]
        rows = self.queries.query(TaskLog).filter(creator_id=worker_id).matching(Among("task_id", task_ids)).oldest().all_rows()
        return WorkerReview(tasks, tuple(rows), self.failures.flagged_lines(task_ids))
