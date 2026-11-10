from engine.errors.user_approval_refusal import UserApprovalRefusal
from argparse import ArgumentParser, Namespace

from engine.enums.access import Access
from engine.enums.actor_type import ActorType
from core.base.helper_type_book import HelperTypeBook
from core.base.caller.caller import Caller
from core.base.page import Page
from core.base.query.conditions.among import Among
from core.base.query.conditions.contains_every import ContainsEvery
from core.base.query.conditions.has_value import HasValue
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.subcommand.page_arguments import page_arguments
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.memories.models.memory_holder import MemoryHolder
from core.modules.memories.support.memory_holder_row import MemoryHolderRow

NAME_COLUMNS = ("given_name", "role", "CAST(agent_id AS TEXT)")


class MemoryAgentsSubcommand(ReadSubcommand[Page[MemoryHolderRow]]):
    """Lists agents that hold memories, with filters and counts."""

    cli_name = "memory"
    name = "agents"

    def __init__(self, queries: Queries, types: HelperTypeBook) -> None:
        self.queries, self.types = queries, types

    def arguments(self, parser: ArgumentParser) -> None:
        page_arguments(parser)
        parser.add_argument("--role", default="")
        parser.add_argument("--access", type=Access, choices=list(Access), default=None)
        parser.add_argument("--name", default="")
        parser.add_argument("--agents", type=int, nargs="+", default=())
        parser.add_argument("--working", action="store_true")
        parser.add_argument("--ended", action="store_true")

    def read(self, arguments: Namespace, caller: Caller) -> Page[MemoryHolderRow]:
        if caller.actor.type is ActorType.AGENT:
            raise UserApprovalRefusal("Show the people using the viewer which agents hold memories?", returns_output=True)
        query = self.queries.query(MemoryHolder)
        if arguments.role:
            query = query.filter(role=arguments.role)
        if arguments.agents:
            query = query.matching(Among("agent_id", arguments.agents))
        if arguments.access is not None:
            query = query.matching(Among("role", self.types.keys_with(arguments.access)))
        if arguments.working:
            query = query.matching(IsNull("ended_at"))
        if arguments.ended:
            query = query.matching(HasValue("ended_at"))
        if arguments.name.split():
            query = query.matching(ContainsEvery(NAME_COLUMNS, arguments.name.split()))
        page = query.descending("agent_id").page(arguments.page, arguments.limit)
        return Page(tuple(MemoryHolderRow.built(holder, self.types) for holder in page.rows), page.number, page.size, page.total)
