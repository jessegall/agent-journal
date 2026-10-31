from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_wildcard import HookWildcard
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.modules.memories.models.enums.delivery_cause import DeliveryCause
from core.modules.memories.rules.support.hook_keywords import hook_keywords
from core.modules.memories.rules.support.hook_memories import HookMemories
from core.modules.memories.models.keyword_memory import KeywordMemory
from core.modules.memories.commands.give_memories import GiveMemories
from core.modules.memories.rules.support.memory_lines import MemoryLines
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.base.agent_role import AgentRole

KEYWORD_LIMIT = "memories.keyword-limit"
KEYWORD_LIMIT_DEFAULT = 3


class KeywordDeliveryRule(DriverRule):
    """When a prompt or a tool use names a keyword of a active memory the agent has not been given since its last
    compaction, the agent is given that memory, at most memories.keyword-limit of them on one hook."""

    name = "memories.keyword-delivery"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.WORKER]

    def __init__(self, queries: Queries, settings: SettingValues, memories: HookMemories) -> None:
        self.queries, self.settings, self.memories = queries, settings, memories

    def answer(self, hook: AgentHook) -> RuleAnswer:
        hook_terms = hook_keywords(hook.event)
        if not hook_terms:
            return RuleAnswer.allowed()
        memory_ids = [keyword.memory_id for keyword in self.queries.query(KeywordMemory).matching(Among("word", hook_terms)).all_rows()]
        limit = self.settings.value(KEYWORD_LIMIT, hook.environment_id, KEYWORD_LIMIT_DEFAULT)
        rows = self.memories.query(hook).among(memory_ids).absent_memories(hook.agent_id).weight_order().all_rows()
        memories = list(rows)[: limit if isinstance(limit, int) else KEYWORD_LIMIT_DEFAULT]
        if not memories:
            return RuleAnswer.allowed()
        return RuleAnswer.with_lines(*MemoryLines.listing(memories)).running(GiveMemories(hook.agent_id, tuple(row.memory_id for row in memories), DeliveryCause.KEYWORD))
