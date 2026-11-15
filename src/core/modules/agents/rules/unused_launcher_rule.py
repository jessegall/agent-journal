from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from engine.enums.agent_role import AgentRole
from core.modules.agents.effects.unused_launcher_effect import UnusedLauncherEffect


class UnusedLauncherRule(DriverRule):
    """The old walk's answer for UnusedLauncherEffect, which owns it, until the walk is deleted."""

    name = UnusedLauncherEffect.key
    hook = HookEventName.TICK
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, effect: UnusedLauncherEffect) -> None:
        self.effect = effect

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.allowed().running(*self.effect.commands_of(hook.event, hook.agent_id))
