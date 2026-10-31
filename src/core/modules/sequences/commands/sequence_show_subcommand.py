from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.sequences.models.sequence import Sequence


class SequenceShowSubcommand(ReadSubcommand[Sequence]):
    """`journal sequence show <n>`: its title, how it starts, and its steps in order."""

    cli_name = "sequence"
    name = "show"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("id", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> Sequence:
        return self.queries.query(Sequence).find(arguments.id)

    def write_output(self, value: object, output: Output) -> None:
        if not isinstance(value, Sequence):
            return
        if output.json_output:
            output.row(value)
            return
        output.line(f"sequence {value.id}: {value.title}, starts by hand only")
        for number, step in enumerate(value.steps, 1):
            output.line(f"{number}. {step}")
