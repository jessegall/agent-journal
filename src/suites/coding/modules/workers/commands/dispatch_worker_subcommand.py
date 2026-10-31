from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.agents.models.agent import Agent
from suites.coding.modules.workers.commands.dispatch_worker import DispatchWorker


class DispatchWorkerSubcommand(Subcommand[DispatchWorker, Agent]):
    """`journal worker dispatch <task> [--library-link <folder>] [--library-copy <folder>]`: a worker for the task."""

    cli_name = "worker"
    name = "dispatch"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("task_id", type=int)
        parser.add_argument("--library-link", action="append", default=[], help="a folder of the environment to link into the worktree")
        parser.add_argument("--library-copy", action="append", default=[], help="a folder of the environment to copy into the worktree")

    def command(self, arguments: Namespace, caller: Caller) -> DispatchWorker:
        return DispatchWorker(arguments.task_id, tuple(arguments.library_link), tuple(arguments.library_copy))
