from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.modules.memories.giving_cause import GivingCause
from core.modules.memories.hook_words import hook_words
from core.modules.memories.memory_give import MemoryGive
from core.modules.memories.memory_lines import MemoryLines
from core.modules.memories.hook_memories import HookMemories
from core.modules.memories.memory_word import MemoryWord
from core.modules.settings.setting_values import SettingValues

KEYWORD_LIMIT = "memories.keyword-limit"
KEYWORD_LIMIT_DEFAULT = 3


class GiveByKeyword(DriverRule):
    """When a prompt or a tool use names a keyword of a standing memory the agent has not been given since its last
    compaction, the agent is given that memory, at most memories.keyword-limit of them on one hook."""

    name = "memories.give-by-keyword"
    hook = "*"
    drivers = ["*"]
    roles = ["main", "worker"]

    def __init__(self, queries: Queries, settings: SettingValues, memories: HookMemories) -> None:
        self.queries, self.settings, self.memories = queries, settings, memories

    def answer(self, hook: AgentHook) -> RuleAnswer:
        named = hook_words(hook.event)
        if not named:
            return RuleAnswer.allowed()
        memory_ids = [word.memory_id for word in self.queries.query(MemoryWord).matching(Among("word", named)).all_rows()]
        limit = self.settings.value(KEYWORD_LIMIT, hook.environment_id, KEYWORD_LIMIT_DEFAULT)
        rows = self.memories.query(hook).among(memory_ids).absent_memories(hook.agent_id).heaviest_first().all_rows()
        memories = list(rows)[: limit if isinstance(limit, int) else KEYWORD_LIMIT_DEFAULT]
        if not memories:
            return RuleAnswer.allowed()
        return RuleAnswer.with_lines(*MemoryLines.listing(memories)).running(MemoryGive(hook.agent_id, tuple(row.memory_id for row in memories), GivingCause.KEYWORD))
