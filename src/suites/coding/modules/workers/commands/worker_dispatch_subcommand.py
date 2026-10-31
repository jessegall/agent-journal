from argparse import ArgumentParser, Namespace

from core.base.subcommand.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.agents.agent import Agent
from suites.coding.modules.workers.commands.worker_dispatch import WorkerDispatch


class WorkerDispatchSubcommand(Subcommand[WorkerDispatch, Agent]):
    """`journal worker dispatch <task>`: a worker for the open task, in a worktree of its own."""

    cli_name = "worker"
    name = "dispatch"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("task_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> WorkerDispatch:
        return WorkerDispatch(arguments.task_id)
