from argparse import ArgumentParser, Namespace

from core.base.cli.list_subcommand import ListSubcommand
from core.base.model.model import Model
from core.base.model.state_book import StateBook
from core.base.model.tables import Tables
from engine.query.conditions.contains_every import ContainsEvery
from engine.query.conditions.has_value import HasValue
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from engine.query.query import Query
from core.modules.memories.models.enums.memory_order import MemoryOrder
from core.modules.memories.models.memory import Memory

SEARCHED_COLUMNS = ("text", "reason")


class MemoryListSubcommand(ListSubcommand):
    """Lists memories with filters, search and ordering."""

    cli_name = "memory"

    def __init__(self, tables: Tables, queries: Queries, book: StateBook) -> None:
        super().__init__(tables.table(Memory), queries, book)

    def model_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--main-agent", action="store_true")
        parser.add_argument("--other-agents", action="store_true")
        parser.add_argument("--search", default="")
        parser.add_argument("--order", type=MemoryOrder, choices=tuple(MemoryOrder), default=MemoryOrder.NEWEST)

    def refined(self, query: Query[Model], arguments: Namespace) -> Query[Model]:
        if arguments.main_agent:
            query = query.matching(IsNull("agent_id"))
        if arguments.other_agents:
            query = query.matching(HasValue("agent_id"))
        if arguments.search.split():
            query = query.matching(ContainsEvery(SEARCHED_COLUMNS, arguments.search.split()))
        return query.descending("weight") if arguments.order is MemoryOrder.WEIGHT else query
