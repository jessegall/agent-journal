from argparse import ArgumentParser, Namespace
from collections.abc import Sequence
from typing import ClassVar

from core.base.caller.caller import Caller
from core.base.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.type_guards import is_tuple
from core.modules.documents.models.text_row import TextRow


class TextListSubcommand(ReadSubcommand[Sequence[TextRow]]):
    """`journal <doc or report> list`: every one, its number and title, oldest first."""

    model: ClassVar[type[TextRow]]
    name = "list"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        return

    def read(self, arguments: Namespace, caller: Caller) -> Sequence[TextRow]:
        return tuple(self.queries.query(self.model).oldest().all_rows())

    def write_output(self, value: object, output: Output) -> None:
        listed = [row for row in value if isinstance(row, TextRow)] if is_tuple(value) else []
        output.write("\n".join(f"{row.id:>4}  {row.title}" for row in listed), {"rows": [output.values(row) for row in listed]})
