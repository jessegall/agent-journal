from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_dependency import TaskDependency
from core.modules.tasks.models.task_log import TaskLog
from core.modules.tasks.support.task_inspection import TaskInspection

LOG_LINES_SHOWN = 100


class TaskInspectSubcommand(ReadSubcommand[TaskInspection]):
    """`journal task inspect <task>`: a task with the tasks it waits on and its latest log lines, in one answer."""

    cli_name = "task"
    name = "inspect"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("task_id", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> TaskInspection:
        waits = [wait.dependency_id for wait in self.queries.query(TaskDependency).filter(task_id=arguments.task_id).all_rows()]
        logs = self.queries.query(TaskLog).filter(task_id=arguments.task_id).newest().page(1, LOG_LINES_SHOWN).rows
        return TaskInspection(self.queries.query(Task).find(arguments.task_id), tuple(self.queries.query(Task).find_many(waits)), tuple(reversed(logs)))

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, TaskInspection):
            output.write(f"task {value.task.id}: {value.task.title}, {len(value.waits)} waits, {len(value.logs)} log lines", value.json())
