from engine.agent.enums.role_group import RoleGroup
from engine.driver.agent_hook import AgentHook
from engine.driver.block_until import BlockUntil
from engine.driver.driver_rule import DriverRule
from engine.driver.interval import Interval
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from core.modules.drivers.models.support.tool_use_span import ToolUseSpan
from core.modules.memories.effects.open_mark_effect import OpenMarkEffect
from core.modules.memories.lines.open_mark_lines import OPEN_MARK_KEY, OpenMarkLines
from core.modules.memories.nudges.weigh_first_nudge import WeighFirstNudge
from core.modules.memories.support.block_conditions.memories_weighed import MemoriesWeighed
from core.modules.memories.support.memory_nudges import WEIGH_COUNTDOWN
from core.modules.memories.support.reached_mark import ReachedMark


class OpenMarkRule(DriverRule):
    """The old walk's answer for OpenMarkLines and OpenMarkEffect, which own it, with the block the walk opens until
    the walk is deleted."""

    name = OPEN_MARK_KEY
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]
    role_group = RoleGroup.MARK

    def __init__(self, lines: OpenMarkLines, effect: OpenMarkEffect, marks: ReachedMark) -> None:
        self.lines, self.effect, self.marks = lines, effect, marks

    def answer(self, hook: AgentHook) -> RuleAnswer:
        mark = self.marks.reached(hook.event, hook.agent_id)
        if mark is None:
            return RuleAnswer.allowed()
        block = BlockUntil(hook.agent_id, WeighFirstNudge.declared().nudge(), MemoriesWeighed(), Interval(ToolUseSpan(mark.tool_uses)), WEIGH_COUNTDOWN.nudge("{left}"))
        return RuleAnswer.with_nudges(*self.lines.nudges(hook.event, hook.agent_id)).running(*self.effect.commands_of(hook.event, hook.agent_id), block)
