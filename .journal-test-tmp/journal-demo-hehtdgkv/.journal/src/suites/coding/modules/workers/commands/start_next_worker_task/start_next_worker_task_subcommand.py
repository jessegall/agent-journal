from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.commands.start_next_worker_task.start_next_worker_task import StartNextWorkerTask
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.commands.support.worker_step_check import DELIVERY_EVENTS, WorkerStepCheck


class StartNextWorkerTaskSubcommand(Subcommand[StartNextWorkerTask, Task]):
    """`journal worker next`: the worker's task is done, with a proof for every point of its brief, and the plugins
    let it through; once its tests pass, or at once with none, the next task in its queue starts."""

    cli_name = "worker"
    name = "next"

    def __init__(self, worktrees: WorktreeQuery, step_check: WorkerStepCheck) -> None:
        self.worktrees, self.step_check = worktrees, step_check

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def command(self, arguments: Namespace, caller: Caller) -> StartNextWorkerTask:
        worktree = self.worktrees.worker_worktree(caller.actor.id)
        if worktree is not None:
            self.step_check.check(worktree, DELIVERY_EVENTS, "put it right in your worktree, then journal worker next again")
        return StartNextWorkerTask()

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Task) and value.state is TaskState.STARTED:
            output.line(f"your next task, task {value.id}: {value.title}\n{value.brief}")
        elif isinstance(value, Task):
            output.line(f"the tests of task {value.id} are queued: stop now, your next task reaches you when they pass")
