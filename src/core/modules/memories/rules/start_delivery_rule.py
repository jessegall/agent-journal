from core.modules.memories.support.memory_nudges import START_MEMORIES
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.memories.rules.support.hook_memories import HookMemories
from core.base.agent_role import AgentRole


class StartDeliveryRule(DriverRule):
    """At a session start and after a compaction, tells the agent how many active memories of its scope and the
    project's it has whose type gives at start and that have no due time; StartMemoriesListener records them."""

    name = "memories.start-delivery"
    start_line_rule = True
    hook = HookEventName.SESSION_START
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.WORKER]

    def __init__(self, memories: HookMemories) -> None:
        self.memories = memories

    def answer(self, hook: AgentHook) -> RuleAnswer:
        count = self.memories.query(hook).start_memories().undated().count()
        return RuleAnswer.with_nudges(START_MEMORIES.nudge(count=count, agent=hook.agent_id)) if count else RuleAnswer.allowed()
