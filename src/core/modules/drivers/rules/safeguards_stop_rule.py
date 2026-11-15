from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from engine.enums.agent_role import AgentRole
from core.modules.drivers.effects.safeguards_stop_effect import SafeguardsStopEffect


class SafeguardsStopRule(DriverRule):
    """The old walk's answer for SafeguardsStopEffect, which owns it, until the walk is deleted."""

    name = SafeguardsStopEffect.key
    hook = HookEventName.STOP_FAILURE
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.HELPER]

    def __init__(self, effect: SafeguardsStopEffect) -> None:
        self.effect = effect

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.allowed().running(*self.effect.commands_of(hook.event, hook.agent_id))
