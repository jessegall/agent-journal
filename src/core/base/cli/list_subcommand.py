from argparse import ArgumentParser, Namespace
from enum import StrEnum
from core.base.caller.caller import Caller
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.model.model import Model
from core.base.model.table import Table
from core.base.page import Page
from core.base.query.queries import Queries
from core.base.query.query import PAGE_SIZE_ROWS
from core.base.cli.subcommand_columns import FOREIGN_KEY_SUFFIX, parser_argument


class ListSubcommand(ReadSubcommand[Page[Model]]):
    """The `list` subcommand the core builds for a model: rows newest first, a page at a time, with a filter flag
    for each enum column and each foreign key, named without its _id."""

    name = "list"

    def __init__(self, table: Table[Model], queries: Queries) -> None:
        self.table, self.queries = table, queries
        self.cli_name = table.model.cli_name

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--page", type=int, default=1)
        parser.add_argument("--limit", type=int, default=PAGE_SIZE_ROWS)
        parser.add_argument("--oldest", action="store_true")
        for column in self.filter_columns():
            parser_argument(parser, f"--{filter_flag(column)}", self.table.types[column])

    def read(self, arguments: Namespace, caller: Caller) -> Page[Model]:
        values = {column: getattr(arguments, filter_flag(column).replace("-", "_")) for column in self.filter_columns()}
        query = self.queries.query(self.table.model).filter(**{column: value for column, value in values.items() if value is not None})
        return (query.oldest() if arguments.oldest else query.newest()).page(arguments.page, arguments.limit)

    def filter_columns(self) -> tuple[str, ...]:
        return tuple(column for column, value_type in self.table.types.items()
                     if column != "id" and (issubclass(value_type, StrEnum) or (column.endswith(FOREIGN_KEY_SUFFIX) and value_type is int)))


def filter_flag(column: str) -> str:
    return column.removesuffix(FOREIGN_KEY_SUFFIX).replace("_", "-")
