from engine.cli.agent_number import AgentNumber
from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.errors.refusal import Refusal
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from suites.coding.modules.workers.commands.release_worker.release_worker import ReleaseWorker
from suites.coding.modules.workers.support.release_outcome import ReleaseOutcome


class ReleaseWorkerSubcommand(Subcommand[ReleaseWorker, ReleaseOutcome]):
    """`journal worker release <worker> "<why>"`: the worker's task goes back to open and its worktree is
    removed."""

    cli_name = "worker"
    name = "release"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("worker_id", type=AgentNumber)
        parser.add_argument("reason", nargs="?", default="")
        parser.add_argument("--reason", dest="reason_flag", default="", help="the reason, written as a flag so a button can fill it")
        parser.add_argument("--abandon", default="", help="why the worker's committed and unmerged work may be left behind")

    def command(self, arguments: Namespace, caller: Caller) -> ReleaseWorker:
        reason = arguments.reason or arguments.reason_flag or arguments.abandon
        if not reason:
            raise Refusal("a release needs a reason", "say why with the reason or --reason")
        return ReleaseWorker(arguments.worker_id, reason, bool(arguments.abandon))

    def write_output(self, value: object, output: Output) -> None:
        if not isinstance(value, ReleaseOutcome):
            return
        output.row(value.worktree)
        if value.unmerged_branch:
            output.line(f"branch {value.unmerged_branch} is kept for its commits")
