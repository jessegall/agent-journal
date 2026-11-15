from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_wildcard import HookWildcard
from engine.driver.rule_answer import RuleAnswer
from core.modules.sequences.effects.sequence_trigger_effect import SequenceTriggerEffect
from core.modules.sequences.lines.sequence_trigger_lines import SEQUENCE_TRIGGER_KEY, SequenceTriggerLines


class SequenceTriggerRule(DriverRule):
    """The old walk's answer for SequenceTriggerLines and SequenceTriggerEffect, which own it, until the walk is deleted."""

    name = SEQUENCE_TRIGGER_KEY
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]

    def __init__(self, lines: SequenceTriggerLines, effect: SequenceTriggerEffect) -> None:
        self.lines, self.effect = lines, effect

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.with_nudges(*self.lines.nudges(hook.event, hook.agent_id)).running(*self.effect.commands_of(hook.event, hook.agent_id))
