from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from suites.coding.modules.workers.effects.missing_process_effect import MissingProcessEffect
from suites.coding.modules.workers.types.worker import Worker


class MissingProcessRule(DriverRule):
    """The old walk's answer for MissingProcessEffect, which owns it, until the walk is deleted."""

    name = MissingProcessEffect.key
    hook = HookEventName.TICK
    drivers = ["*"]
    roles = [AgentRole.MAIN, Worker.key]

    def __init__(self, effect: MissingProcessEffect) -> None:
        self.effect = effect

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.allowed().running(*self.effect.commands_of(hook.event, hook.agent_id))
