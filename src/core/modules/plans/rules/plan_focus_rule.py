from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from core.modules.plans.lines.plan_focus_lines import PlanFocusLines


class PlanFocusRule(DriverRule):
    """The old walk's answer for PlanFocusLines, which owns it, until the walk is deleted."""

    name = PlanFocusLines.key
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.HELPER]
    history = True

    def __init__(self, lines: PlanFocusLines) -> None:
        self.lines = lines

    def answer(self, hook: AgentHook) -> RuleAnswer:
        nudges = self.lines.nudges(hook.event, hook.agent_id)
        return RuleAnswer.with_nudges(*nudges) if nudges else RuleAnswer.allowed()
