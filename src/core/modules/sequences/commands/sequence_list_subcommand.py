from argparse import ArgumentParser, Namespace
from collections.abc import Sequence as Rows

from core.base.caller.caller import Caller
from core.base.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.type_guards import is_tuple
from core.modules.sequences.models.sequence import Sequence


class SequenceListSubcommand(ReadSubcommand[Rows[Sequence]]):
    """`journal sequence list`: every sequence with its number of steps."""

    cli_name = "sequence"
    name = "list"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        return

    def read(self, arguments: Namespace, caller: Caller) -> Rows[Sequence]:
        return tuple(self.queries.query(Sequence).oldest().all_rows())

    def write_output(self, value: object, output: Output) -> None:
        listed = [row for row in value if isinstance(row, Sequence)] if is_tuple(value) else []
        output.write("\n".join(f"{row.id:>4}  {row.title} ({len(row.steps)} steps)" for row in listed), {"rows": [output.values(row) for row in listed]})
