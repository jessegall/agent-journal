from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from engine.agent.enums.role_group import RoleGroup
from core.modules.tasks.lines.one_in_hand_lines import OneInHandLines


class TaskStartRule(DriverRule):
    """The old walk's answer for OneInHandLines, which owns it, until the walk is deleted."""

    name = OneInHandLines.key
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    role_group = RoleGroup.TASK

    def __init__(self, lines: OneInHandLines) -> None:
        self.lines = lines

    def answer(self, hook: AgentHook) -> RuleAnswer:
        nudges = self.lines.nudges(hook.event, hook.agent_id)
        return RuleAnswer.with_nudges(*nudges) if nudges else RuleAnswer.allowed()
