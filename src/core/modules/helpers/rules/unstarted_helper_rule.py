from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from engine.agent.enums.role_group import RoleGroup
from engine.scope.actor_scope import ActorScope
from core.modules.helpers.effects.unstarted_helper_effect import UnstartedHelperEffect


class UnstartedHelperRule(DriverRule):
    """The old walk's answer for UnstartedHelperEffect, which owns it, until the walk is deleted."""

    name = UnstartedHelperEffect.key
    hook = HookEventName.TICK
    drivers = ["*"]
    role_group = RoleGroup.ANY
    disabled_scopes = [ActorScope]

    def __init__(self, effect: UnstartedHelperEffect) -> None:
        self.effect = effect

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.allowed().running(*self.effect.commands_of(hook.event, hook.agent_id))
