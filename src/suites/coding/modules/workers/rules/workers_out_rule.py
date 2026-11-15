from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from engine.enums.agent_role import AgentRole
from suites.coding.modules.workers.lines.workers_out_lines import WorkersOutLines


class WorkersOutRule(DriverRule):
    """The old walk's answer for WorkersOutLines, which owns it, until the walk is deleted."""

    name = WorkersOutLines.key
    start_line_rule = True
    hook = HookEventName.SESSION_START
    drivers = ["coding.main"]
    roles = [AgentRole.MAIN]

    def __init__(self, lines: WorkersOutLines) -> None:
        self.lines = lines

    def answer(self, hook: AgentHook) -> RuleAnswer:
        nudges = self.lines.nudges(hook.event, hook.agent_id)
        return RuleAnswer.with_nudges(*nudges) if nudges else RuleAnswer.allowed()
