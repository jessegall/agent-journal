from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.rule_answer import RuleAnswer
from core.modules.memories.memory_lines import MemoryLines
from core.modules.memories.memory_mark_open import MemoryMarkOpen
from core.modules.memories.memory_marks import DEFAULT_MARKS, MemoryMarks
from core.modules.memories.standing_memory_query import StandingMemoryQuery
from core.modules.settings.setting_values import SettingValues

MARKS_SETTING = "memories.marks"


class OpenMark(DriverRule):
    """When the agent's context window passes a mark of memories.marks it has not reached since its last compaction,
    a mark opens and the agent is given its memories of a type given at a mark, heaviest first, to weigh."""

    name = "memories.open-mark"
    hook = "post_tool_use"
    drivers = ["*"]
    roles = ["main", "worker"]

    def __init__(self, marks: MemoryMarks, standing: StandingMemoryQuery, settings: SettingValues) -> None:
        self.marks, self.standing, self.settings = marks, standing, settings

    def answer(self, hook: AgentHook) -> RuleAnswer:
        percent = hook.event.context_percent
        if percent is None:
            return RuleAnswer.allowed()
        reached = self.marks.next_reached(hook.agent_id, percent, self.settings.numbers(MARKS_SETTING, hook.environment_id, DEFAULT_MARKS))
        if reached is None:
            return RuleAnswer.allowed()
        memories = list(self.standing.scope(hook.agent_id, hook.environment_id).mark_memories().heaviest_first().all_rows())
        return RuleAnswer.with_lines(*MemoryLines.weigh(reached, memories)).running(MemoryMarkOpen(hook.agent_id, reached))
