from argparse import ArgumentParser, Namespace
from core.base.subcommand.caller import Caller
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.model.model import Model
from core.base.model.table import Table
from core.base.query.queries import Queries


class ShowSubcommand(ReadSubcommand[Model]):
    """The `show <id>` subcommand the core builds for a model: one row in full."""

    name = "show"

    def __init__(self, table: Table[Model], queries: Queries) -> None:
        self.table, self.queries = table, queries
        self.cli_name = table.model.cli_name

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("id", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> Model:
        return self.queries.query(self.table.model).find(arguments.id)
