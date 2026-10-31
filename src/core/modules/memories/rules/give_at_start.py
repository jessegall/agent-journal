from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.rule_answer import RuleAnswer
from core.modules.memories.giving_cause import GivingCause
from core.modules.memories.memory_give import MemoryGive
from core.modules.memories.memory_lines import MemoryLines
from core.modules.memories.standing_memory_query import StandingMemoryQuery


class GiveAtStart(DriverRule):
    """At a session start, and after a compaction, the agent is given every standing memory of its scope and the
    project's of a type given at start and with no due time, rules first and facts heaviest first, each giving kept."""

    name = "memories.give-at-start"
    hook = "session_start"
    drivers = ["*"]
    roles = ["main", "worker"]

    def __init__(self, standing: StandingMemoryQuery) -> None:
        self.standing = standing

    def answer(self, hook: AgentHook) -> RuleAnswer:
        memories = list(self.standing.scope(hook.agent_id, hook.environment_id).start_memories().undated().giving_order().all_rows())
        if not memories:
            return RuleAnswer.allowed()
        return RuleAnswer.with_lines(*MemoryLines.listing(memories)).running(MemoryGive(hook.agent_id, tuple(row.memory_id for row in memories), GivingCause.START))
