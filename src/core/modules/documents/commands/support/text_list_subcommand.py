from argparse import ArgumentParser, Namespace
from typing import ClassVar

from engine.database.database import READ_LIMIT_ROWS
from engine.caller.caller import Caller
from engine.row.page import Page, is_page
from engine.query.queries import Queries
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.documents.models.text_row import TextRow


class TextListSubcommand(ReadSubcommand[Page[TextRow]]):
    """`journal <doc or report> list [--page <n>]`: the number and title of each, newest first, a page at a time."""

    model: ClassVar[type[TextRow]]
    name = "list"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--page", type=int, default=1)

    def read(self, arguments: Namespace, caller: Caller) -> Page[TextRow]:
        return self.queries.query(self.model).newest().page(arguments.page, READ_LIMIT_ROWS)

    def write_output(self, value: object, output: Output) -> None:
        if not is_page(value):
            return
        listed = [row for row in value.rows if isinstance(row, TextRow)]
        lines = [f"{row.id:>4}  {row.title}" for row in listed]
        if not value.is_last:
            lines.append(f"page {value.number}, {len(listed)} of {value.total}: --page {value.number + 1} for the next")
        output.write("\n".join(lines), {"rows": [output.values(row) for row in listed], "page": value.number, "size": value.size, "total": value.total})
