from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.cli.agent_number import AgentNumber
from engine.subcommand.subcommand import Subcommand
from suites.coding.modules.workers.commands.decide_behind_check.leave_worker_behind import LeaveWorkerBehind


class LeaveWorkerBehindSubcommand(Subcommand[LeaveWorkerBehind, None]):
    """`journal merger leave <worker> --why "<why it does not matter>"`: leaves a worker behind its base alone until
    it falls further behind."""

    cli_name = "merger"
    name = "leave"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("worker_id", type=AgentNumber)
        parser.add_argument("--why", required=True, help="why the new base commits do not matter to the worker")

    def command(self, arguments: Namespace, caller: Caller) -> LeaveWorkerBehind:
        return LeaveWorkerBehind(arguments.worker_id, arguments.why)
