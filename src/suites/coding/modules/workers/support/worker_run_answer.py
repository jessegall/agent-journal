from core.base.subcommand.output import Output
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.modules.workers.models.worker_operation import WorkerOperation
from suites.coding.modules.workers.support.worker_next_task import WorkerNextTask


class WorkerRunAnswer:
    """What a worker reads when a command of its own runs in the background: the open task to work on, or to
    stop until it is told the command ended."""

    def __init__(self, tasks: TaskQuery, next_task: WorkerNextTask) -> None:
        self.tasks, self.next_task = tasks, next_task

    def write(self, value: object, output: Output) -> bool:
        if not isinstance(value, WorkerOperation):
            return False
        output.line(f"worker {value.worker_id} command accepted: output {value.process_id}; {self.instruction(self.next_task.following(value.worker_id))}")
        return True

    def test_instruction(self, worker_id: int) -> str:
        started = self.tasks.started_tasks(worker_id)
        return self.instruction(started[0] if started else self.next_task.following(worker_id))

    @staticmethod
    def instruction(task: Task | None) -> str:
        return "stop, you will be told when it ends" if task is None else f"go on with task {task.id}, you hear when it ends"
