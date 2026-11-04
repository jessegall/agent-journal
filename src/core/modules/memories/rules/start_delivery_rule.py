from core.modules.memories.support.memory_nudges import START_MEMORIES, START_SHARED_MEMORIES
from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.memories.rules.support.hook_memories import HookMemories
from core.base.role_group import RoleGroup


class StartDeliveryRule(DriverRule):
    """At a session start and after a compaction, tells the agent how many active memories of its scope and the
    project's it has whose type gives at start and that have no due time; StartMemoriesListener records them."""

    name = "memories.start-delivery"
    start_line_rule = True
    hook = HookEventName.SESSION_START
    drivers = ["*"]
    role_group = RoleGroup.PROMPT

    def __init__(self, memories: HookMemories) -> None:
        self.memories = memories

    def answer(self, hook: AgentHook) -> RuleAnswer:
        count = self.memories.query(hook).start_memories().undated().count()
        line = START_MEMORIES if hook.role == AgentRole.MAIN else START_SHARED_MEMORIES
        return RuleAnswer.with_nudges(line.nudge(count=count, agent=hook.agent_id)) if count else RuleAnswer.allowed()
