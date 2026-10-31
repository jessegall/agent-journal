from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from suites.coding.modules.workers.commands.release_worker import ReleaseWorker
from suites.coding.modules.workers.support.release_outcome import ReleaseOutcome


class ReleaseWorkerSubcommand(Subcommand[ReleaseWorker, ReleaseOutcome]):
    """`journal worker release <worker> "<why>"`: the worker's task goes back to open and its worktree is removed."""

    cli_name = "worker"
    name = "release"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("worker_id", type=int)
        parser.add_argument("reason")

    def command(self, arguments: Namespace, caller: Caller) -> ReleaseWorker:
        return ReleaseWorker(arguments.worker_id, arguments.reason)

    def write_output(self, value: object, output: Output) -> None:
        if not isinstance(value, ReleaseOutcome):
            return
        output.row(value.worktree)
        if value.unmerged_branch:
            output.line(f"branch {value.unmerged_branch} is kept for its commits")
