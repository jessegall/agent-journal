from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from engine.scope.actor_scope import ActorScope
from suites.coding.modules.workers.effects.inactive_helper_effect import InactiveHelperEffect
from suites.coding.modules.workers.lines.inactive_helper_lines import INACTIVE_HELPER_KEY, InactiveHelperLines
from suites.coding.modules.workers.types.worker import Worker


class InactiveHelperRule(DriverRule):
    """The old walk's answer for InactiveHelperLines and InactiveHelperEffect, which own it, until the walk is deleted."""

    name = INACTIVE_HELPER_KEY
    hook = HookEventName.TICK
    drivers = ["*"]
    roles = [AgentRole.MAIN, Worker.key]
    disabled_scopes = [ActorScope]

    def __init__(self, lines: InactiveHelperLines, effect: InactiveHelperEffect) -> None:
        self.lines, self.effect = lines, effect

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.with_nudges(*self.lines.nudges(hook.event, hook.agent_id)).running(*self.effect.commands_of(hook.event, hook.agent_id))
