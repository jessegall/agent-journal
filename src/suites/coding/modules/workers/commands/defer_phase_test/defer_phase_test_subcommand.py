from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.cli.agent_number import AgentNumber
from engine.errors.refusal import Refusal
from engine.subcommand.subcommand import Subcommand
from suites.coding.modules.workers.commands.defer_phase_test.defer_phase_test import DeferPhaseTest

USAGE = 'journal merger defer-test <worker> "<test paths>" --why "<why they wait>"'


class DeferPhaseTestSubcommand(Subcommand[DeferPhaseTest, str]):
    """`journal merger defer-test <worker> "<test paths>" --why "<text>"`: leaves failing test paths of a
    checkpoint's own test out until the next checkpoint."""

    cli_name = "merger"
    name = "defer-test"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("worker_id", type=AgentNumber)
        parser.add_argument("paths", help="the whole test paths to leave out, in one quoted text")
        parser.add_argument("--why", default="", help="why these paths wait for the next checkpoint")
        parser.add_argument("--ask", type=int, default=None, help="the line of the worker's question this settles; its oldest open one otherwise")

    def command(self, arguments: Namespace, caller: Caller) -> DeferPhaseTest:
        paths = tuple(arguments.paths.split())
        if not paths or not arguments.why.strip():
            raise Refusal("a deferral needs its test paths and why they wait", USAGE)
        return DeferPhaseTest(arguments.worker_id, paths, arguments.why, arguments.ask)
