from argparse import ArgumentParser, Namespace
from collections.abc import Sequence
from typing import ClassVar

from engine.caller.caller import Caller
from engine.cli.number_list import number_list
from engine.cli.view_row_page import ViewRowPage
from engine.model.view_model import ViewModel
from engine.query.conditions.among import Among
from engine.query.conditions.greater import Greater
from engine.query.conditions.less import Less
from engine.query.queries import Queries
from engine.query.query import PAGE_SIZE_ROWS, Query
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand


class ViewRowsSubcommand(ReadSubcommand[ViewRowPage]):
    """The read of a window that lists a view: rows newest first, by id, only the columns of the view, for the
    filters it names; --after-id and --before-id page by id and --ids lists only the rows with those ids.
    """

    model: ClassVar[type[ViewModel]]
    filters: ClassVar[Sequence[str]] = ()

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--limit", type=int, default=PAGE_SIZE_ROWS)
        parser.add_argument("--after-id", type=int, default=None)
        parser.add_argument("--before-id", type=int, default=None)
        parser.add_argument("--ids", type=number_list, default=None)
        for column in self.filters:
            parser.add_argument(f"--{column.replace('_', '-')}", type=int if column.endswith("_id") else str, default=None)

    def read(self, arguments: Namespace, caller: Caller) -> ViewRowPage:
        given = {column: getattr(arguments, column) for column in self.filters if getattr(arguments, column) is not None}
        query = self.filtered(self.queries.query(self.model).filter(**given), arguments)
        if arguments.after_id is not None:
            query = query.matching(Greater("id", arguments.after_id))
        if arguments.before_id is not None:
            query = query.matching(Less("id", arguments.before_id))
        if arguments.ids is not None:
            query = query.matching(Among("id", arguments.ids))
        return ViewRowPage(tuple(query.newest().limited(arguments.limit)))

    def filtered(self, query: Query[ViewModel], arguments: Namespace) -> Query[ViewModel]:
        return query

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, ViewRowPage):
            output.write("\n".join("  ".join(str(item) for item in row.json().values()) for row in value.rows) or "nothing found", value.json())
