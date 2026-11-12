from engine.subcommand.output import Output
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.modules.workers.models.worker_operation import WorkerOperation
from suites.coding.modules.workers.models.enums.worker_operation_name import WorkerOperationName
from suites.coding.modules.workers.support.worker_next_task import WorkerNextTask
from core.modules.agents.support.agent_label import AgentLabel
from engine.cli.row_numbers import RowNumbers

# An update changes the files under the worker, so it does not go on working meanwhile.
UPDATE_INSTRUCTION = "do not edit files until it ends, you hear when it ends"


class WorkerRunAnswer:
    """What a worker reads when a command of its own runs in the background: the open task to work on, or to
    stop until it is told the command ended."""

    def __init__(self, tasks: TaskQuery, next_task: WorkerNextTask, numbers: RowNumbers) -> None:
        self.numbers = numbers
        self.tasks, self.next_task = tasks, next_task

    def write(self, value: object, output: Output) -> bool:
        if not isinstance(value, WorkerOperation):
            return False
        output.line(f"{AgentLabel.from_row_id(value.worker_id, self.numbers, "worker").text} command accepted: output {value.process_id}; {self.operation_instruction(value)}")
        return True

    def operation_instruction(self, operation: WorkerOperation) -> str:
        if operation.name is WorkerOperationName.UPDATE:
            return UPDATE_INSTRUCTION
        return self.instruction(self.next_task.following(operation.worker_id))

    def test_instruction(self, worker_id: int) -> str:
        started = self.tasks.started_tasks(worker_id)
        return self.instruction(started[0] if started else self.next_task.following(worker_id))

    @staticmethod
    def instruction(task: Task | None) -> str:
        return "stop, you will be told when it ends" if task is None else f"go on with task {task.id}, you hear when it ends"
