from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.assignments.commands.unassign.unassign import Unassign
from core.modules.assignments.models.assignment import Assignment


class UnassignSubcommand(Subcommand[Unassign, tuple[Assignment, ...]]):
    """`journal unassign <model> <id> [--from <actor>]`: removes a row from one actor, or from every actor."""

    cli_name = "unassign"
    name = "unassign"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("subject_model", metavar="model")
        parser.add_argument("subject_id", metavar="id", type=int)
        parser.add_argument("--from", type=int, dest="actor_id")

    def command(self, arguments: Namespace, caller: Caller) -> Unassign:
        return Unassign(arguments.subject_model, arguments.subject_id, arguments.actor_id)
