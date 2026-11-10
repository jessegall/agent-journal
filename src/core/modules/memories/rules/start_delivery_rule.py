from core.modules.memories.support.memory_nudges import START_MEMORIES
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.memories.queries.active_memory_query import ActiveMemoryQuery
from engine.enums.role_group import RoleGroup


class StartDeliveryRule(DriverRule):
    """At a session start and after a compaction, tells the agent how many active memories it is given;
    StartMemoriesListener records them."""

    name = "memories.start-delivery"
    start_line_rule = True
    hook = HookEventName.SESSION_START
    drivers = ["*"]
    role_group = RoleGroup.ANY

    def __init__(self, memories: ActiveMemoryQuery) -> None:
        self.memories = memories

    def answer(self, hook: AgentHook) -> RuleAnswer:
        count = self.memories.count()
        return RuleAnswer.with_nudges(START_MEMORIES.nudge(count=count, agent=hook.agent_id)) if count else RuleAnswer.allowed()
