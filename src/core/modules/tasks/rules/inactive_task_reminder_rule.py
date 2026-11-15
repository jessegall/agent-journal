from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from core.modules.tasks.lines.quiet_task_lines import QuietTaskLines


class InactiveTaskReminderRule(DriverRule):
    """The old walk's answer for QuietTaskLines, which owns it, until the walk is deleted."""

    name = QuietTaskLines.key
    hook = HookEventName.TICK
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, lines: QuietTaskLines) -> None:
        self.lines = lines

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.with_nudges(*self.lines.nudges(hook.event, hook.agent_id))
