from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.cli.agent_number import AgentNumber
from engine.subcommand.subcommand import Subcommand
from suites.coding.modules.workers.commands.decide_behind_check.order_worker_update import OrderWorkerUpdate


class OrderWorkerUpdateSubcommand(Subcommand[OrderWorkerUpdate, None]):
    """`journal merger update <worker> --why "<what overlaps>"`: tells a worker behind its base to update its
    worktree at its next stopping point."""

    cli_name = "merger"
    name = "update"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("worker_id", type=AgentNumber)
        parser.add_argument("--why", required=True, help="what the new base commits share with the worker's files")

    def command(self, arguments: Namespace, caller: Caller) -> OrderWorkerUpdate:
        return OrderWorkerUpdate(arguments.worker_id, arguments.why)
