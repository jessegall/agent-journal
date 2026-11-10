from engine.cli.row_numbers import RowNumbers
from engine.cli.agent_number import AGENT_MODEL_NAME
from core.modules.memories.support.memory_nudges import START_MEMORIES
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
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

    def __init__(self, memories: ActiveMemoryQuery, numbers: RowNumbers) -> None:
        self.numbers = numbers
        self.memories = memories

    def answer(self, hook: AgentHook) -> RuleAnswer:
        count = self.memories.count()
        return RuleAnswer.with_nudges(START_MEMORIES.nudge(count=count, agent=self.numbers.number(AGENT_MODEL_NAME, hook.agent_id))) if count else RuleAnswer.allowed()
