from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_phases import WorkerPhases
from suites.coding.modules.workers.commands.support.worker_step_check import DELIVERY_EVENTS, WorkerStepCheck
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.commands.deliver_task.deliver_task import DeliverTask
from suites.coding.modules.workers.support.delivery_differences import differences_flag, required_differences


class DeliverTaskSubcommand(Subcommand[DeliverTask, Task]):
    """`journal worker deliver`: hands in all the worker's tasks, once none is queued and its last has a proof for
    every point of its brief."""

    cli_name = "worker"
    name = "deliver"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        differences_flag(parser)

    def __init__(self, worktrees: WorktreeQuery, step_check: WorkerStepCheck, phases: WorkerPhases) -> None:
        self.worktrees, self.step_check, self.phases = worktrees, step_check, phases

    def command(self, arguments: Namespace, caller: Caller) -> DeliverTask:
        differences = required_differences(arguments)
        worktree = self.worktrees.worker_worktree(caller.actor.id)
        if worktree is not None:
            self.step_check.check(worktree, DELIVERY_EVENTS, "put it right in your worktree, then journal worker deliver again")
        return DeliverTask(differences)

    def write_output(self, value: object, output: Output) -> None:
        if not isinstance(value, Task):
            return
        if value.state is TaskState.TESTING and self.phases.is_grouped(value):
            output.line(f"the tests of {self.phases.test_label(value)} are queued: stop now, you hear when they end")
            return
        output.row(value)
