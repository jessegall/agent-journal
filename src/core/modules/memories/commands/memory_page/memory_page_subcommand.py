from engine.errors.user_approval_refusal import UserApprovalRefusal
from argparse import ArgumentParser, Namespace

from engine.enums.actor_type import ActorType
from engine.helper_type.helper_type_book import HelperTypeBook
from core.base.caller.caller import Caller
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.memories.commands.memory_list.memory_list_subcommand import MemoryListSubcommand
from core.modules.memories.models.memory import Memory
from core.modules.memories.models.memory_holder import MemoryHolder
from core.modules.memories.support.memory_holder_row import MemoryHolderRow

from core.modules.memories.support.memory_page import MemoryPage


class MemoryPageSubcommand(ReadSubcommand[MemoryPage]):
    """Reads a page of memories with its agents for a person."""

    cli_name = "memory"
    name = "page"

    def __init__(self, memories: MemoryListSubcommand, queries: Queries, types: HelperTypeBook) -> None:
        self.memories, self.queries, self.types = memories, queries, types

    def arguments(self, parser: ArgumentParser) -> None:
        self.memories.arguments(parser)

    def read(self, arguments: Namespace, caller: Caller) -> MemoryPage:
        if caller.actor.type is ActorType.AGENT:
            raise UserApprovalRefusal("Show memories for all agents in the viewer?", returns_output=True)
        page = self.memories.read(arguments, caller)
        ids = {row.agent_id for row in page.rows if isinstance(row, Memory) and row.agent_id is not None}
        holders = self.queries.query(MemoryHolder).matching(Among("agent_id", tuple(sorted(ids)))).all_rows() if ids else ()
        return MemoryPage(page, tuple(MemoryHolderRow.built(holder, self.types) for holder in holders))

    def write_output(self, value: object, output: Output) -> None:
        assert isinstance(value, MemoryPage)
        page = value.page
        output.write("\n".join(str(row) for row in page.rows) or "nothing found", {
            "rows": [output.values(row) for row in page.rows], "page": page.number, "size": page.size,
            "total": page.total, "agents": [output.values(agent) for agent in value.agents],
        })
