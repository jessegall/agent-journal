from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from suites.coding.modules.workers.commands.merge_worker.merge_worker import MergeWorker
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.merge_outcome import MergeOutcome
from suites.coding.modules.workers.commands.support.worker_step_check import WorkerStepCheck

MERGE_EVENTS = ["worker_merging"]


class MergeWorkerSubcommand(Subcommand[MergeWorker, MergeOutcome]):
    """`journal worker merge <worker>`: the worker's checked work goes into the environment's branch."""

    cli_name = "worker"
    name = "merge"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("worker_id", type=int)
        parser.add_argument("--read-important", default="", help="what you make of the worker's important log lines")

    def __init__(self, worktrees: WorktreeQuery, step_check: WorkerStepCheck) -> None:
        self.worktrees, self.step_check = worktrees, step_check

    def command(self, arguments: Namespace, caller: Caller) -> MergeWorker:
        worktree = self.worktrees.worker_worktree(arguments.worker_id)
        if worktree is not None:
            self.step_check.check(worktree, MERGE_EVENTS, "the worker puts it right: journal worker send it the reason, then merge again")
        return MergeWorker(arguments.worker_id, arguments.read_important)

    def write_output(self, value: object, output: Output) -> None:
        if not isinstance(value, MergeOutcome):
            return
        output.row(value.worktree)
        if value.conflicts:
            output.line(f"merging {value.worktree.base_branch} in clashed on {', '.join(value.conflicts)}: task {value.worktree.task_id} went back to"
                        f" worker {value.worktree.session_agent_id}")
