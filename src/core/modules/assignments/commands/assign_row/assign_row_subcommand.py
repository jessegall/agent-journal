from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.assignments.commands.assign_row.assign_row import AssignRow
from core.modules.assignments.support.cascade import Cascade


class AssignRowSubcommand(Subcommand[AssignRow, Cascade]):
    """`journal assign <model> <id> --to <actor>`: gives one row to a user or an agent; with `--from-parent`
    in place of `--to`, the row inherits the assignment of its parent."""

    cli_name = "assign"
    name = "assign"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("subject_model", metavar="model")
        parser.add_argument("subject_id", metavar="id", type=int)
        parser.add_argument("--to", type=int, dest="actor_id")
        parser.add_argument("--from-parent", action="store_true")
        parser.add_argument("--no-cascade", action="store_false", dest="cascade")
        parser.add_argument("--override", action="store_true")

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Cascade):
            output.write(value.text, {"assigned": value.counts(), "kept": [{"model": row.model_name, "id": row.row_id, "reason": row.reason.value} for row in value.kept_rows]})

    def command(self, arguments: Namespace, caller: Caller) -> AssignRow:
        return AssignRow(arguments.subject_model, arguments.subject_id, arguments.actor_id, arguments.cascade, arguments.override, arguments.from_parent)
