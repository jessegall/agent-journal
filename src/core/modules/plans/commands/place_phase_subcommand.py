from argparse import ArgumentParser, Namespace
from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.plans.commands.place_phase import PlacePhase
from core.modules.plans.models.phase_task import PhaseTask


class PlacePhaseSubcommand(Subcommand[PlacePhase, PhaseTask]):
    """`journal phase place <task> --phase <phase>`: puts a task at the end of a phase, out of any other."""

    cli_name = "phase"
    name = "place"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("task_id", type=int)
        parser.add_argument("--phase", type=int, required=True, dest="phase_id")

    def command(self, arguments: Namespace, caller: Caller) -> PlacePhase:
        return PlacePhase(arguments.task_id, arguments.phase_id)
