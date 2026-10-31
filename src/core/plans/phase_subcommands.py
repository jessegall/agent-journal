from argparse import ArgumentParser, Namespace

from core.base.subcommand.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.plans.phase import Phase
from core.plans.phase_commands import PhaseMake, PhaseMove, PhasePlace
from core.plans.phase_task import PhaseTask


class PhaseMakeSubcommand(Subcommand[PhaseMake, Phase]):
    """`journal phase make --plan <plan> "<title>" [--goal "<what is true when done>"] [--checkpoint]`: adds a
    phase at the end of the plan."""

    cli_noun = "phase"
    name = "make"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("title")
        parser.add_argument("--plan", type=int, required=True, dest="plan_id")
        parser.add_argument("--goal", default="")
        parser.add_argument("--checkpoint", action="store_true")

    def command(self, arguments: Namespace, caller: Caller) -> PhaseMake:
        return PhaseMake(arguments.plan_id, arguments.title, arguments.goal, arguments.checkpoint)


class PhaseMoveSubcommand(Subcommand[PhaseMove, Phase]):
    """`journal phase move <phase> --to <place>`: moves a phase to another place in its plan."""

    cli_noun = "phase"
    name = "move"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("phase_id", type=int)
        parser.add_argument("--to", type=int, required=True, dest="position")

    def command(self, arguments: Namespace, caller: Caller) -> PhaseMove:
        return PhaseMove(arguments.phase_id, arguments.position)


class PhasePlaceSubcommand(Subcommand[PhasePlace, PhaseTask]):
    """`journal phase place <task> --phase <phase>`: puts a task at the end of a phase, out of any other."""

    cli_noun = "phase"
    name = "place"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("task_id", type=int)
        parser.add_argument("--phase", type=int, required=True, dest="phase_id")

    def command(self, arguments: Namespace, caller: Caller) -> PhasePlace:
        return PhasePlace(arguments.task_id, arguments.phase_id)
