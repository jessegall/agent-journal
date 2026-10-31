from argparse import ArgumentParser, Namespace
from core.base.subcommand.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.plans.phase import Phase
from core.modules.plans.phase_move import PhaseMove


class PhaseMoveSubcommand(Subcommand[PhaseMove, Phase]):
    """`journal phase move <phase> --to <place>`: moves a phase to another place in its plan."""

    cli_name = "phase"
    name = "move"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("phase_id", type=int)
        parser.add_argument("--to", type=int, required=True, dest="position")

    def command(self, arguments: Namespace, caller: Caller) -> PhaseMove:
        return PhaseMove(arguments.phase_id, arguments.position)
