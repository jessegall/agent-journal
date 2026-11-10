from argparse import ArgumentParser, Namespace

from core.base.database.database import READ_LIMIT_ROWS
from core.base.caller.caller import Caller
from engine.row.page import Page, is_page
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.suggestions.models.suggestion import Suggestion


class SuggestionListSubcommand(ReadSubcommand[Page[Suggestion]]):
    """`journal suggestion list [--open] [--page <n>]`: the suggestions with their answers, or only those
    still waiting, newest first, a page at a time."""

    cli_name = "suggestion"
    name = "list"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--open", action="store_true")
        parser.add_argument("--page", type=int, default=1)

    def read(self, arguments: Namespace, caller: Caller) -> Page[Suggestion]:
        query = self.queries.query(Suggestion).newest()
        return (query.matching(IsNull("answer")) if arguments.open else query).page(arguments.page, READ_LIMIT_ROWS)

    def write_output(self, value: object, output: Output) -> None:
        if not is_page(value):
            return
        listed = [row for row in value.rows if isinstance(row, Suggestion)]
        lines = [f"{row.id:>4}  {row.title}  {row.answer or 'waiting'}" for row in listed]
        if not value.is_last:
            lines.append(f"page {value.number}, {len(listed)} of {value.total}: --page {value.number + 1} for the next")
        output.write("\n".join(lines), {"rows": [output.values(row) for row in listed], "page": value.number, "size": value.size, "total": value.total})
