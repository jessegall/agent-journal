from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_step_check import WorkerStepCheck
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.commands.deliver_task import DeliverTask

DELIVERY_EVENTS = ["worker_clocking_out", "worker_delivering"]


class DeliverTaskSubcommand(Subcommand[DeliverTask, Task]):
    """`journal worker deliver`: the worker's task is done, with a proof for every point of its brief."""

    cli_name = "worker"
    name = "deliver"

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def __init__(self, worktrees: WorktreeQuery, step_check: WorkerStepCheck) -> None:
        self.worktrees, self.step_check = worktrees, step_check

    def command(self, arguments: Namespace, caller: Caller) -> DeliverTask:
        worktree = self.worktrees.worker_worktree(caller.actor.id)
        if worktree is not None:
            self.step_check.check(worktree, DELIVERY_EVENTS, "put it right in your worktree, then journal worker deliver again")
        return DeliverTask()
