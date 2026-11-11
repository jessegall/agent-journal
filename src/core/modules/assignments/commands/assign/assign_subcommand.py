from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.assignments.commands.assign.assign import Assign
from core.modules.assignments.models.assignment import Assignment


class AssignSubcommand(Subcommand[Assign, tuple[Assignment, ...]]):
    """`journal assign <model> <id> --to <actor>`: gives one row to a person or an agent."""

    cli_name = "assign"
    name = "assign"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("subject_model", metavar="model")
        parser.add_argument("subject_id", metavar="id", type=int)
        parser.add_argument("--to", type=int, dest="actor_id", required=True)
        parser.add_argument("--no-cascade", action="store_false", dest="cascade")
        parser.add_argument("--override", action="store_true")

    def command(self, arguments: Namespace, caller: Caller) -> Assign:
        return Assign(arguments.subject_model, arguments.subject_id, arguments.actor_id, arguments.cascade, arguments.override)
