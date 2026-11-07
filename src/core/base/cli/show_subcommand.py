from argparse import ArgumentParser, Namespace
from core.base.caller.caller import Caller
from core.base.cli.row_links import RowLinks
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.model.model import Model
from core.base.model.table import Table
from core.base.query.queries import Queries


class ShowSubcommand(ReadSubcommand[Model]):
    """The `show <id>` subcommand the core builds for a model: one row in full, then what it links to."""

    name = "show"

    def __init__(self, table: Table[Model], queries: Queries, links: RowLinks) -> None:
        self.table, self.queries, self.links = table, queries, links
        self.cli_name = table.model.cli_name

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("id", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> Model:
        return self.queries.query(self.table.model).find(arguments.id)

    def write_output(self, value: object, output: Output) -> None:
        super().write_output(value, output)
        if isinstance(value, Model) and not output.json_output:
            for line in self.links.lines(self.table.model.model_name, value.id):
                output.line(line)
