from argparse import ArgumentParser, Namespace

from core.base.cli.list_subcommand import ListSubcommand
from core.base.model.model import Model
from core.base.model.state_book import StateBook
from core.base.model.tables import Tables
from engine.query.queries import Queries
from engine.query.query import Query
from core.modules.tasks.conditions.task_tag_match import TaskTagMatch
from core.modules.tasks.models.task import Task


class TaskListSubcommand(ListSubcommand):
    """Lists tasks, optionally requiring every named tag."""

    cli_name = "task"

    def __init__(self, tables: Tables, queries: Queries, book: StateBook) -> None:
        super().__init__(tables.table(Task), queries, book)

    def model_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--tag", action="append", default=[])

    def refined(self, query: Query[Model], arguments: Namespace) -> Query[Model]:
        for word in arguments.tag:
            query = query.matching(TaskTagMatch(word))
        return query
