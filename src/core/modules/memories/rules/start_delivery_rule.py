from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.memories.models.enums.delivery_cause import DeliveryCause
from core.modules.memories.rules.support.hook_memories import HookMemories
from core.modules.memories.commands.give_memories import GiveMemories
from core.modules.memories.rules.support.memory_lines import MemoryLines
from core.base.agent_role import AgentRole


class StartDeliveryRule(DriverRule):
    """At a session start and after a compaction, gives the agent each active memory of its scope and the
    project's whose type gives at start and that has no due time: rules first, facts heaviest first."""

    name = "memories.start-delivery"
    hook = HookEventName.SESSION_START
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.WORKER]

    def __init__(self, memories: HookMemories) -> None:
        self.memories = memories

    def answer(self, hook: AgentHook) -> RuleAnswer:
        memories = list(self.memories.query(hook).start_memories().undated().delivery_order().all_rows())
        if not memories:
            return RuleAnswer.allowed()
        return RuleAnswer.with_lines(*MemoryLines.listing(memories)).running(GiveMemories(hook.agent_id, tuple(row.memory_id for row in memories), DeliveryCause.START))
