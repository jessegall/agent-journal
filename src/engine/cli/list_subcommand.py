from argparse import ArgumentParser, Namespace
from enum import StrEnum
from engine.model.removable import Removable
from engine.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import STATE, Model
from engine.model.state_book import StateBook
from engine.model.table import Table
from engine.row.page import Page, is_page
from engine.query.conditions.greater import Greater
from engine.query.conditions.less import Less
from engine.query.queries import Queries
from engine.query.query import PAGE_SIZE_ROWS, Query
from engine.cli.subcommand_columns import FOREIGN_KEY_SUFFIX, parser_argument
from core.base.database.constraint_refusals import ENVIRONMENT_COLUMN


SESSION_PREFIX = "session_"


class ListSubcommand(ReadSubcommand[Page[Model]]):
    """The `list` subcommand the core builds for a model: rows newest first, a page at a time, with
    a filter flag for each enum column and each foreign key, environment_text without its _id;
    --environment takes the environment's name, as every other command does, or its number;
    --after-id and --before-id keep only the rows newer or older than an id; --columns id,title prints only
    those columns."""

    name = "list"

    def __init__(self, table: Table[Model], queries: Queries, book: StateBook | None = None) -> None:
        self.table, self.queries, self.book = table, queries, book or StateBook()
        self.cli_name = table.model.cli_name
        self.columns: tuple[str, ...] = ()

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--page", type=int, default=1)
        parser.add_argument("--limit", type=int, default=PAGE_SIZE_ROWS)
        parser.add_argument("--oldest", action="store_true")
        parser.add_argument("--after-id", type=int, default=None)
        parser.add_argument("--before-id", type=int, default=None)
        parser.add_argument("--columns", default="")
        if issubclass(self.table.model, Removable):
            parser.add_argument("--removed", action="store_true", help="also show removed rows")
        lifecycle = self.book.lifecycle(self.table.model)
        for column in self.filter_columns():
            if column == STATE and lifecycle is not None and lifecycle.added_states:
                parser.add_argument("--state", choices=lifecycle.state_words())
                continue
            if column != ENVIRONMENT_COLUMN:
                parser_argument(parser, f"--{filter_flag(column)}", self.table.types[column])
        self.model_arguments(parser)

    def model_arguments(self, parser: ArgumentParser) -> None:
        return None

    def refined(self, query: Query[Model], arguments: Namespace) -> Query[Model]:
        return query

    def read(self, arguments: Namespace, caller: Caller) -> Page[Model]:
        self.columns = tuple(column for column in arguments.columns.split(",") if column)
        values = {column: getattr(arguments, filter_flag(column).replace("-", "_")) for column in self.filter_columns()}
        if values.get(ENVIRONMENT_COLUMN) is not None:
            values[ENVIRONMENT_COLUMN] = caller.environment_id
        query = self.queries.query(self.table.model).filter(**{column: value for column, value in values.items() if value is not None})
        if getattr(arguments, "removed", False):
            query = query.with_removed()
        if arguments.after_id is not None:
            query = query.matching(Greater("id", arguments.after_id))
        if arguments.before_id is not None:
            query = query.matching(Less("id", arguments.before_id))
        query = self.refined(query, arguments)
        return (query.oldest() if arguments.oldest else query.newest()).page(arguments.page, arguments.limit)

    def write_output(self, value: object, output: Output) -> None:
        if is_page(value):
            output.page(value, self.columns)

    def filter_columns(self) -> tuple[str, ...]:
        columns = (column for column, value_type in self.table.types.items()
                   if column != "id" and (column in self.table.model.filter_fields or issubclass(value_type, StrEnum)
                                          or (column.endswith(FOREIGN_KEY_SUFFIX) and value_type is int)))
        return tuple(column for column in columns if column != ENVIRONMENT_COLUMN or not issubclass(self.table.model, EnvironmentScoped))


def filter_flag(column: str) -> str:
    return column.removeprefix(SESSION_PREFIX).removesuffix(FOREIGN_KEY_SUFFIX).replace("_", "-")
