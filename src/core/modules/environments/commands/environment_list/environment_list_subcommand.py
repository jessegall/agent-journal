from argparse import ArgumentParser, Namespace

from engine.enums.actor_type import ActorType
from engine.caller.caller import Caller
from engine.cli.list_subcommand import ListSubcommand
from engine.model.model import Model
from engine.model.state_book import StateBook
from engine.model.tables import Tables
from engine.row.page import Page
from engine.query.queries import Queries
from engine.query.query import Query
from core.modules.environments.models.environment import Environment


class EnvironmentListSubcommand(ListSubcommand):
    """Lists environments, including test environments when requested."""

    cli_name = "environment"

    def __init__(self, tables: Tables, queries: Queries, book: StateBook) -> None:
        super().__init__(tables.table(Environment), queries, book)

    def model_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--all", action="store_true", help="include test environments")

    def read(self, arguments: Namespace, caller: Caller) -> Page[Model]:
        arguments.all = arguments.all or caller.actor.type is ActorType.AGENT
        return super().read(arguments, caller)

    def refined(self, query: Query[Model], arguments: Namespace) -> Query[Model]:
        return query if arguments.all else query.filter(test=False)
