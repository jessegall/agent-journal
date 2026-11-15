from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from core.modules.processes.effects.leftover_run_effect import LeftoverRunEffect


class LeftoverRunRule(DriverRule):
    """The old walk's answer for LeftoverRunEffect, which owns it, until the walk is deleted."""

    name = LeftoverRunEffect.key
    hook = HookEventName.SESSION_START
    drivers = ["*"]

    def __init__(self, effect: LeftoverRunEffect) -> None:
        self.effect = effect

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.allowed().running(*self.effect.commands_of(hook.event, hook.agent_id))
