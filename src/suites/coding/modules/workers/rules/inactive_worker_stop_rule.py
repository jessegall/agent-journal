from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from engine.scope.actor_scope import ActorScope
from suites.coding.modules.workers.effects.inactive_worker_stop_effect import InactiveWorkerStopEffect
from suites.coding.modules.workers.lines.inactive_worker_stop_lines import IDLE_WORKER_STOP_KEY, InactiveWorkerStopLines


class InactiveWorkerStopRule(DriverRule):
    """The old walk's answer for InactiveWorkerStopLines and InactiveWorkerStopEffect, which own it, until the walk is deleted."""

    name = IDLE_WORKER_STOP_KEY
    hook = HookEventName.TICK
    drivers = ["coding.main"]
    roles = [AgentRole.MAIN]
    disabled_scopes = [ActorScope]

    def __init__(self, lines: InactiveWorkerStopLines, effect: InactiveWorkerStopEffect) -> None:
        self.lines, self.effect = lines, effect

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.with_nudges(*self.lines.nudges(hook.event, hook.agent_id)).running(*self.effect.commands_of(hook.event, hook.agent_id))
