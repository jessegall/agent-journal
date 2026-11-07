from argparse import Namespace

from core.base.actor_type import ActorType
from core.base.caller.caller import Caller
from core.base.query.conditions.has_value import HasValue
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.subcommand.read_subcommand import ReadSubcommand
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
            raise Refusal("only a person reads counts of every agent's memories", "an agent lists its own with journal memory list")
        query = self.queries.query(Memory).filter(state=MemoryState.ACTIVE)
        return MemoryCounts(query.matching(IsNull("agent_id")).count(), query.matching(HasValue("agent_id")).count(), query.count())
