from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from suites.coding.modules.workers.commands.merge_worker import MergeWorker
from suites.coding.modules.workers.support.merge_outcome import MergeOutcome


class MergeWorkerSubcommand(Subcommand[MergeWorker, MergeOutcome]):
    """`journal worker merge <worker>`: the worker's checked work goes into the environment's branch."""

    cli_name = "worker"
    name = "merge"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("worker_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> MergeWorker:
        return MergeWorker(arguments.worker_id)

    def write_output(self, value: object, output: Output) -> None:
        if not isinstance(value, MergeOutcome):
            return
        output.row(value.worktree)
        if value.conflicts:
            output.line(f"the rebase onto {value.worktree.base_branch} clashed on {', '.join(value.conflicts)}: task {value.worktree.task_id} went back to"
                        f" worker {value.worktree.agent_id}")
