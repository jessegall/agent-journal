from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from engine.scope.actor_scope import ActorScope
from suites.coding.modules.workers.lines.unstarted_worker_lines import UnstartedWorkerLines


class UnstartedWorkerRule(DriverRule):
    """The old walk's answer for UnstartedWorkerLines, which owns it, until the walk is deleted."""

    name = UnstartedWorkerLines.key
    hook = HookEventName.TICK
    drivers = ["coding.main"]
    roles = [AgentRole.MAIN]
    disabled_scopes = [ActorScope]

    def __init__(self, lines: UnstartedWorkerLines) -> None:
        self.lines = lines

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.with_nudges(*self.lines.nudges(hook.event, hook.agent_id))
