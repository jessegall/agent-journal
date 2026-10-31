from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.memories.rules.support.hook_memories import HookMemories
from core.modules.memories.support.mark_tracker import DEFAULT_MARKS, MarkTracker
from core.modules.memories.rules.support.memory_lines import MemoryLines
from core.modules.memories.commands.open_memory_mark import OpenMemoryMark
from core.modules.settings.bindings.support.setting_values import SettingValues

MARKS_SETTING = "memories.marks"


class OpenMarkRule(DriverRule):
    """When the agent's context window passes a mark of memories.marks it has not reached since its last compaction,
    a mark opens and the agent is given its memories of a type given at a mark, heaviest first, to weigh."""

    name = "memories.open-mark"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]
    roles = ["main", "worker"]

    def __init__(self, marks: MarkTracker, settings: SettingValues, memories: HookMemories) -> None:
        self.marks, self.settings, self.memories = marks, settings, memories

    def answer(self, hook: AgentHook) -> RuleAnswer:
        percent = hook.event.context_percent
        if percent is None:
            return RuleAnswer.allowed()
        reached = self.marks.next_reached(hook.agent_id, percent, self.settings.numbers(MARKS_SETTING, hook.environment_id, DEFAULT_MARKS))
        if reached is None:
            return RuleAnswer.allowed()
        memories = list(self.memories.query(hook).mark_memories().weight_order().all_rows())
        return RuleAnswer.with_lines(*MemoryLines.weigh(reached, memories)).running(OpenMemoryMark(hook.agent_id, reached))
