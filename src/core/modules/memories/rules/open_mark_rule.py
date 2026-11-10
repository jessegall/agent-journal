from core.modules.settings.bindings.support.context_share import ContextShare
from core.modules.memories.support.block_conditions.memories_weighed import MemoriesWeighed
from core.modules.memories.support.memory_nudges import WEIGH_COUNTDOWN, WEIGH_FIRST, WEIGH_MEMORIES
from engine.driver.agent_hook import AgentHook
from engine.driver.block_until import BlockUntil
from engine.driver.driver_rule import DriverRule
from engine.driver.hook_event_name import HookEventName
from engine.driver.interval import Interval
from engine.driver.rule_answer import RuleAnswer
from core.modules.drivers.models.support.tool_use_span import ToolUseSpan
from core.modules.memories.queries.active_memory_query import ActiveMemoryQuery
from core.modules.memories.support.mark_tracker import MarkTracker
from core.modules.memories.support.memory_settings import MARK_SPACING_TOKENS_SETTING, MARK_TOOL_USES_SETTING, MARKS_SETTING
from core.modules.memories.commands.open_memory_mark.open_memory_mark import OpenMemoryMark
from engine.setting.setting_values import SettingValues
from engine.enums.role_group import RoleGroup



class OpenMarkRule(DriverRule):
    """When the agent's context, counted against the context limit when one is on, passes a mark of
    memories.marks it has not reached since its last compaction, a mark opens and the agent is given its
    memories, heaviest first, to weigh. It is blocked once the mark's tool uses have passed. Helpers get
    the marks too; a jump past two marks gives one line, naming the highest. Two marks too few tokens apart
    count as the higher."""

    name = "memories.open-mark"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]
    role_group = RoleGroup.MARK

    def __init__(self, marks: MarkTracker, settings: SettingValues, memories: ActiveMemoryQuery, share: ContextShare) -> None:
        self.marks, self.settings, self.memories, self.share = marks, settings, memories, share

    def spaced_marks(self, hook: AgentHook, marks: tuple[int, ...]) -> tuple[int, ...]:
        maximum_tokens = self.share.maximum_tokens(hook.event.program, hook.event.session)
        return marks if maximum_tokens is None else self.marks.spaced(marks, maximum_tokens, self.settings.number(MARK_SPACING_TOKENS_SETTING))

    def answer(self, hook: AgentHook) -> RuleAnswer:
        percent = self.share.percent(hook.event.program, hook.event.session)
        if percent is None:
            return RuleAnswer.allowed()
        marks = self.settings.numbers(MARKS_SETTING)
        reached = self.marks.next_reached(hook.agent_id, percent, self.spaced_marks(hook, marks))
        if reached is None or self.marks.open_marks(hook.agent_id):
            return RuleAnswer.allowed()
        tool_uses = self.settings.numbers(MARK_TOOL_USES_SETTING)
        uses = dict(zip(marks, tool_uses)).get(reached, tool_uses[-1])
        memories = list(self.memories.weight_order().all_rows())
        return RuleAnswer.with_nudges(WEIGH_MEMORIES.nudge(percent=reached, uses=uses, count=len(memories), memories=",".join(str(memory.memory_id) for memory in memories))).running(
            OpenMemoryMark(hook.agent_id, reached), BlockUntil(hook.agent_id, WEIGH_FIRST.nudge(), MemoriesWeighed(), Interval(ToolUseSpan(uses)), WEIGH_COUNTDOWN.nudge("{left}")))
