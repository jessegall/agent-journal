from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.journal_home import JournalHome
from core.base.provider.providers import Providers
from core.modules.memories.rules.support.hook_memories import HookMemories
from core.modules.memories.support.mark_tracker import MarkTracker
from core.modules.memories.support.memory_settings import MARKS_SETTING
from core.modules.memories.rules.support.memory_lines import MemoryLines
from core.modules.memories.commands.open_memory_mark import OpenMemoryMark
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.base.agent_role import AgentRole



class OpenMarkRule(DriverRule):
    """When the agent's context window, as its program's provider reads it, passes a mark of memories.marks
    it has not reached since its last compaction, a mark opens and the agent is given its memories of a
    type given at a mark, heaviest first, to weigh."""

    name = "memories.open-mark"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.WORKER]

    def __init__(self, marks: MarkTracker, settings: SettingValues, memories: HookMemories, providers: Providers, home: JournalHome) -> None:
        self.marks, self.settings, self.memories, self.providers, self.home = marks, settings, memories, providers, home

    def answer(self, hook: AgentHook) -> RuleAnswer:
        percent = self.providers.provider(hook.event.program).context_percent(self.home, hook.event.session)
        if percent is None:
            return RuleAnswer.allowed()
        reached = self.marks.next_reached(hook.agent_id, percent, self.settings.numbers(MARKS_SETTING, hook.environment_id))
        if reached is None:
            return RuleAnswer.allowed()
        memories = list(self.memories.query(hook).mark_memories().weight_order().all_rows())
        return RuleAnswer.with_lines(*MemoryLines.weigh(reached, memories)).running(OpenMemoryMark(hook.agent_id, reached))
