from argparse import ArgumentParser, Namespace
from core.base.subcommand.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.plans.phase import Phase
from core.modules.plans.phase_make import PhaseMake


class PhaseMakeSubcommand(Subcommand[PhaseMake, Phase]):
    """`journal phase make --plan <plan> "<title>" [--goal "<what is true when done>"] [--checkpoint]`: adds a
    phase at the end of the plan."""

    cli_name = "phase"
    name = "make"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("title")
        parser.add_argument("--plan", type=int, required=True, dest="plan_id")
        parser.add_argument("--goal", default="")
        parser.add_argument("--checkpoint", action="store_true")

    def command(self, arguments: Namespace, caller: Caller) -> PhaseMake:
        return PhaseMake(arguments.plan_id, arguments.title, arguments.goal, arguments.checkpoint)
