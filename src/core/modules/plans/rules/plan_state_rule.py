from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from core.modules.plans.lines.plan_state_lines import PlanStateLines


class PlanStateRule(DriverRule):
    """The old walk's answer for PlanStateLines, which owns it, until the walk is deleted."""

    name = PlanStateLines.key
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN]
    history = True

    def __init__(self, lines: PlanStateLines) -> None:
        self.lines = lines

    def answer(self, hook: AgentHook) -> RuleAnswer:
        nudges = self.lines.nudges(hook.event, hook.agent_id)
        return RuleAnswer.with_nudges(*nudges) if nudges else RuleAnswer.allowed()
