from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from engine.enums.agent_role import AgentRole
from core.modules.plans.lines.plan_task_end_lines import PlanTaskEndLines


class PlanTaskLineRule(DriverRule):
    """The old walk's answer for PlanTaskEndLines, which owns it, until the walk is deleted."""

    name = PlanTaskEndLines.key
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, lines: PlanTaskEndLines) -> None:
        self.lines = lines

    def answer(self, hook: AgentHook) -> RuleAnswer:
        nudges = self.lines.nudges(hook.event, hook.agent_id)
        return RuleAnswer.with_nudges(*nudges) if nudges else RuleAnswer.allowed()
