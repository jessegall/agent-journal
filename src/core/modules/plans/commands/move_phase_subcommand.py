from argparse import ArgumentParser, Namespace
from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.plans.models.phase import Phase
from core.modules.plans.commands.move_phase import MovePhase


class MovePhaseSubcommand(Subcommand[MovePhase, Phase]):
    """`journal phase move <phase> --to <place>`: moves a phase to another place in its plan."""

    cli_name = "phase"
    name = "move"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("phase_id", type=int)
        parser.add_argument("--to", type=int, required=True, dest="position")

    def command(self, arguments: Namespace, caller: Caller) -> MovePhase:
        return MovePhase(arguments.phase_id, arguments.position)
