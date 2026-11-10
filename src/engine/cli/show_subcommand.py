from engine.cli.agent_number import row_argument_type
from argparse import ArgumentParser, Namespace
from engine.caller.caller import Caller
from engine.cli.row_links import RowLinks
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from engine.model.model import Model
from engine.model.table import Table
from engine.query.queries import Queries


class ShowSubcommand(ReadSubcommand[Model]):
    """The `show <id>` subcommand the core builds for a model: one row in full, then what it links to."""

    name = "show"

    def __init__(self, table: Table[Model], queries: Queries, links: RowLinks) -> None:
        self.table, self.queries, self.links = table, queries, links
        self.cli_name = table.model.cli_name

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("id", type=row_argument_type(self.table.model.numbered))

    def read(self, arguments: Namespace, caller: Caller) -> Model:
        return self.queries.query(self.table.model).find(arguments.id)

    def write_output(self, value: object, output: Output) -> None:
        super().write_output(value, output)
        if isinstance(value, Model) and not output.json_output:
            for line in self.links.lines(self.table.model.model_name, value.id):
                output.line(line)
