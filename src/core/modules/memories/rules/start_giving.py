from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.rule_answer import RuleAnswer
from core.modules.memories.giving_cause import GivingCause
from core.modules.memories.memory_give import MemoryGive
from core.modules.memories.memory_lines import MemoryLines
from core.modules.memories.hook_memories import HookMemories


class StartGiving(DriverRule):
    """At a session start and after a compaction, gives the agent each standing memory of its scope and the
    project's whose type gives at start and that has no due time: rules first, facts heaviest first."""

    name = "memories.start-giving"
    hook = "session_start"
    drivers = ["*"]
    roles = ["main", "worker"]

    def __init__(self, memories: HookMemories) -> None:
        self.memories = memories

    def answer(self, hook: AgentHook) -> RuleAnswer:
        memories = list(self.memories.query(hook).start_memories().undated().giving_order().all_rows())
        if not memories:
            return RuleAnswer.allowed()
        return RuleAnswer.with_lines(*MemoryLines.listing(memories)).running(MemoryGive(hook.agent_id, tuple(row.memory_id for row in memories), GivingCause.START))
