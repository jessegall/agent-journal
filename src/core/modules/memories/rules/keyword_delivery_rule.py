from core.modules.memories.support.memory_nudges import MEMORY_LINE
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_wildcard import HookWildcard
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.modules.memories.models.enums.delivery_cause import DeliveryCause
from core.base.driver.hook_keywords import hook_keywords
from core.modules.memories.queries.active_memory_query import ActiveMemoryQuery
from core.modules.memories.models.keyword_memory import KeywordMemory
from core.modules.memories.commands.give_memories.give_memories import GiveMemories
from core.modules.settings.bindings.support.setting_values import SettingValues
from engine.enums.role_group import RoleGroup
from core.modules.memories.support.memory_settings import KEYWORD_LIMIT



class KeywordDeliveryRule(DriverRule):
    """When a prompt or a tool use names a keyword of a active memory the agent has not been given since
    its last compaction, the agent is given that memory, at most memories.keyword-limit of them on one
    hook."""

    name = "memories.keyword-delivery"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    role_group = RoleGroup.PROMPT

    def __init__(self, queries: Queries, settings: SettingValues, memories: ActiveMemoryQuery) -> None:
        self.queries, self.settings, self.memories = queries, settings, memories

    def answer(self, hook: AgentHook) -> RuleAnswer:
        hook_terms = hook_keywords(hook.event)
        if not hook_terms:
            return RuleAnswer.allowed()
        memory_ids = [keyword.memory_id for keyword in self.queries.query(KeywordMemory).matching(Among("word", hook_terms)).all_rows()]
        limit = self.settings.number(KEYWORD_LIMIT)
        rows = self.memories.among(memory_ids).absent_memories(hook.agent_id).weight_order().all_rows()
        memories = list(rows)[:limit]
        if not memories:
            return RuleAnswer.allowed()
        return RuleAnswer.with_nudges(*(MEMORY_LINE.nudge(memory=memory.memory_id) for memory in memories)).running(GiveMemories(hook.agent_id, tuple(row.memory_id for row in memories), DeliveryCause.KEYWORD))
