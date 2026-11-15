from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from engine.scope.actor_scope import ActorScope
from suites.coding.modules.workers.lines.context_stop_now_lines import ContextStopNowLines
from suites.coding.modules.workers.types.worker import Worker


class ContextStopNowRule(DriverRule):
    """The old walk's answer for ContextStopNowLines, which owns it, until the walk is deleted."""

    name = ContextStopNowLines.key
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN, Worker.key]
    disabled_scopes = [ActorScope]

    def __init__(self, lines: ContextStopNowLines) -> None:
        self.lines = lines

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.with_nudges(*self.lines.nudges(hook.event, hook.agent_id))
