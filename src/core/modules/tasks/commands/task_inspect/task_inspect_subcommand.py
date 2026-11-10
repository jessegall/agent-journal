import json
from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.tasks.support.task_opener import TaskOpener
from core.modules.tasks.support.task_wait_attempts import TaskWaitAttempts
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_inspection_row import TaskInspectionRow
from core.modules.tasks.support.task_inspection import TaskInspection


class TaskInspectSubcommand(ReadSubcommand[TaskInspection]):
    """`journal task inspect <task>`: a task with the tasks it waits on and its latest log lines, in one
    answer."""

    cli_name = "task"
    name = "inspect"

    def __init__(self, queries: Queries, attempts: TaskWaitAttempts) -> None:
        self.queries, self.attempts = queries, attempts

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("task_id", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> TaskInspection:
        task = self.queries.query(Task).find(arguments.task_id)
        row = self.queries.query(TaskInspectionRow).find(arguments.task_id)
        openers = json.loads(row.openers)
        attempts = self.attempts.last_runs([wait["id"] for wait in openers if wait["command"]])
        return TaskInspection(task, tuple(json.loads(row.waits)), tuple(reversed(json.loads(row.logs))), tuple(TaskOpener.parsed(wait, attempts.get(wait["id"], "")).text for wait in openers), row.helper_id, row.helper_name, row.helper_main, tuple(json.loads(row.block_renewals)), tags=row.tags)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, TaskInspection):
            output.write(f"task {value.task.id}: {value.task.title}, {len(value.waits)} waits, {len(value.logs)} log lines", value.json())
