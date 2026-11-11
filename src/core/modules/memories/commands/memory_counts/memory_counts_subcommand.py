from engine.command.errors.user_approval_refusal import UserApprovalRefusal
from argparse import Namespace

from engine.enums.actor_type import ActorType
from engine.caller.caller import Caller
from engine.query.conditions.has_value import HasValue
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.memories.models.enums.memory_state import MemoryState
from core.modules.memories.models.memory import Memory

from core.modules.memories.support.memory_counts import MemoryCounts


class MemoryCountsSubcommand(ReadSubcommand[MemoryCounts]):
    """Reads active memory counts for a person."""

    cli_name = "memory"
    name = "counts"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def read(self, arguments: Namespace, caller: Caller) -> MemoryCounts:
        if caller.actor.type is ActorType.AGENT:
            raise UserApprovalRefusal("Show memory counts for all agents in the viewer?", returns_output=True)
        query = self.queries.query(Memory).filter(state=MemoryState.ACTIVE)
        return MemoryCounts(query.matching(IsNull("agent_id")).count(), query.matching(HasValue("agent_id")).count(), query.count())
