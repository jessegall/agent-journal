from argparse import ArgumentParser, Namespace

from engine.cli.list_subcommand import ListSubcommand
from engine.model.model import Model
from engine.model.state_book import StateBook
from engine.model.tables import Tables
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.query.query import Query
from core.modules.processes.models.process import Process
from core.modules.processes.queries.process_query import OPEN


class ProcessListSubcommand(ListSubcommand):
    """Lists runs; --open lists the runs that have not ended, running or in the background, and --state keeps its
    one state."""

    cli_name = "process"

    def __init__(self, tables: Tables, queries: Queries, book: StateBook) -> None:
        super().__init__(tables.table(Process), queries, book)

    def model_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--open", action="store_true", help="runs that have not ended: running or in the background")

    def refined(self, query: Query[Model], arguments: Namespace) -> Query[Model]:
        return query.matching(Among("state", OPEN)) if arguments.open else query
