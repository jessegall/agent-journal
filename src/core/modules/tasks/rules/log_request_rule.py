from engine.agent.enums.role_group import RoleGroup
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from core.modules.tasks.lines.log_request_lines import LogRequestLines


class LogRequestRule(DriverRule):
    """The old walk's answer for LogRequestLines, which owns it, until the walk is deleted."""

    name = LogRequestLines.key
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    role_group = RoleGroup.TASK

    def __init__(self, lines: LogRequestLines) -> None:
        self.lines = lines

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.with_nudges(*self.lines.nudges(hook.event, hook.agent_id))
