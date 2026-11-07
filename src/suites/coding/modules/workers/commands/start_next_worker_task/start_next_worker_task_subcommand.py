from core.base.command.command import Command
from suites.coding.modules.workers.support.worker_command_request import WorkerCommandRequest
from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.commands.start_next_worker_task.start_next_worker_task import StartNextWorkerTask
from suites.coding.modules.workers.support.delivery_differences import differences_flag, required_differences
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_phases import WorkerPhases
from suites.coding.modules.workers.commands.support.worker_step_check import DELIVERY_EVENTS, WorkerStepCheck


class StartNextWorkerTaskSubcommand(Subcommand[Command[object], Task]):
    """`journal worker next`: the worker's task is done, with a proof for every point of its brief, and the plugins
    let it through; once its tests pass, or at once with none, the next task in its queue starts."""

    cli_name = "worker"
    name = "next"
    outward = True

    def __init__(self, worktrees: WorktreeQuery, step_check: WorkerStepCheck, phases: WorkerPhases, requests: WorkerCommandRequest) -> None:
        self.requests = requests
        self.worktrees, self.step_check, self.phases = worktrees, step_check, phases

    def arguments(self, parser: ArgumentParser) -> None:
        WorkerCommandRequest.arguments(parser)
        differences_flag(parser)

    def command(self, arguments: Namespace, caller: Caller) -> Command[object]:
        differences = required_differences(arguments)
        worktree = self.worktrees.worker_worktree(caller.actor.id)
        if worktree is not None:
            self.step_check.check(worktree, DELIVERY_EVENTS, "put it right in your worktree, then journal worker next again")
        return self.requests.command(StartNextWorkerTask(differences), caller.actor.id,
                                     ["worker", "next", "--differences", differences], arguments, caller)

    def write_output(self, value: object, output: Output) -> None:
        if WorkerCommandRequest.write_output(value, output):
            return
        if isinstance(value, Task) and value.state is TaskState.STARTED:
            output.line(f"your next task, task {value.id}: {value.title}\n{value.brief}")
        elif isinstance(value, Task):
            queued = self.phases.test_label(value)
            output.line(f"the tests of {queued} are queued: stop now, your next task reaches you when they pass")
