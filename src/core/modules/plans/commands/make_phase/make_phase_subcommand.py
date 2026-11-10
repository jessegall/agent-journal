from argparse import ArgumentParser, Namespace
from engine.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.plans.models.phase import Phase
from core.modules.plans.commands.make_phase.make_phase import MakePhase


class MakePhaseSubcommand(Subcommand[MakePhase, Phase]):
    """`journal phase make --plan <plan> "<title>" [--goal "<what is true when done>"] [--checkpoint]
    [--test "<command>"]`: adds a phase at the end of the plan."""

    cli_name = "phase"
    name = "make"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("title")
        parser.add_argument("--plan", type=int, required=True, dest="plan_id")
        parser.add_argument("--goal", default="")
        parser.add_argument("--checkpoint", action="store_true")
        parser.add_argument("--test", default="", dest="test_command")

    def command(self, arguments: Namespace, caller: Caller) -> MakePhase:
        return MakePhase(arguments.plan_id, arguments.title, arguments.goal, arguments.checkpoint, arguments.test_command)
