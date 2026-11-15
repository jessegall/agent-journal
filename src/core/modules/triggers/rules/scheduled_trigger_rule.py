from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.agent_role import AgentRole
from engine.enums.hook_wildcard import HookWildcard
from core.modules.triggers.effects.scheduled_trigger_effect import ScheduledTriggerEffect
from core.modules.triggers.lines.scheduled_trigger_lines import SCHEDULED_TRIGGER_KEY, ScheduledTriggerLines


class ScheduledTriggerRule(DriverRule):
    """The old walk's answer for ScheduledTriggerLines and ScheduledTriggerEffect, which own it, until the walk is deleted."""

    name = SCHEDULED_TRIGGER_KEY
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, lines: ScheduledTriggerLines, effect: ScheduledTriggerEffect) -> None:
        self.lines, self.effect = lines, effect

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.with_nudges(*self.lines.nudges(hook.event, hook.agent_id)).running(*self.effect.commands_of(hook.event, hook.agent_id))
