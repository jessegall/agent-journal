from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.command.command import Command
from engine.subcommand.subcommand import Subcommand
from suites.coding.modules.workers.commands.merger.worker_text_arguments import worker_text_arguments
from suites.coding.modules.workers.commands.pass_behind_check.pass_behind_check import PassBehindCheck
from suites.coding.modules.workers.commands.return_worker.return_worker import ReturnWorker
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.behind_checks import BehindChecks


class ReturnWorkerSubcommand(Subcommand[Command[None], None]):
    """`journal merger pass <worker> "<why>"`: leaves the worker to the main agent; for a worker still cut whose
    worktree waits for a decision about its base, hands that decision to the main agent instead."""

    cli_name = "merger"
    name = "pass"

    def __init__(self, worktrees: WorktreeQuery, checks: BehindChecks) -> None:
        self.worktrees, self.checks = worktrees, checks

    def arguments(self, parser: ArgumentParser) -> None:
        worker_text_arguments(parser, "reason")

    def command(self, arguments: Namespace, caller: Caller) -> Command[None]:
        worktree = self.worktrees.worker_worktree(arguments.worker_id)
        if worktree is not None and worktree.state is WorktreeState.CUT and self.checks.waits_for_decision(worktree):
            return PassBehindCheck(arguments.worker_id, arguments.reason)
        return ReturnWorker(arguments.worker_id, arguments.reason)
