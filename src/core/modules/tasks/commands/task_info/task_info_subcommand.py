import json
from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.query.queries import Queries
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_inspection_row import TaskInspectionRow
from core.modules.tasks.support.task_info import TaskInfo
from core.modules.tasks.support.task_opener import TaskOpener
from core.modules.tasks.support.task_wait_attempts import TaskWaitAttempts
from core.modules.tasks.support.task_comment_reads import TaskCommentReads


class TaskInfoSubcommand(ReadSubcommand[TaskInfo]):
    """`journal task info <task>`: the short read for an agent that delegates, with the title, state, priority,
    complexity, tags, comment count, holder and waits, and no brief or conversation."""

    cli_name = "task"
    name = "info"

    def __init__(self, queries: Queries, comments: TaskCommentReads, attempts: TaskWaitAttempts) -> None:
        self.queries, self.comments, self.attempts = queries, comments, attempts

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("task_id", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> TaskInfo:
        task = self.queries.query(Task).find(arguments.task_id)
        row = self.queries.query(TaskInspectionRow).find(arguments.task_id)
        openers = json.loads(row.openers)
        attempts = self.attempts.last_runs([wait["id"] for wait in openers if wait["command"]])
        dependencies = json.loads(row.waits)
        listed = {f"tasks:{wait['id']}" for wait in dependencies}
        waits = (*(f"task {wait['id']} ({wait['state']})" for wait in dependencies),
                 *(TaskOpener.parsed(wait, attempts.get(wait["id"], "")).text for wait in openers if wait["target"] not in listed))
        return TaskInfo(task.id, task.title, task.state.value, task.priority, task.complexity, tuple(row.tags), self.comments.total(task), task.delegated_to, waits)
