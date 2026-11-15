from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from engine.agent.enums.role_group import RoleGroup
from core.modules.memories.lines.start_delivery_lines import StartDeliveryLines


class StartDeliveryRule(DriverRule):
    """The old walk's answer for StartDeliveryLines, which owns it, until the walk is deleted."""

    name = StartDeliveryLines.key
    start_line_rule = True
    hook = HookEventName.SESSION_START
    drivers = ["*"]
    role_group = RoleGroup.ANY

    def __init__(self, lines: StartDeliveryLines) -> None:
        self.lines = lines

    def answer(self, hook: AgentHook) -> RuleAnswer:
        nudges = self.lines.nudges(hook.event, hook.agent_id)
        return RuleAnswer.with_nudges(*nudges) if nudges else RuleAnswer.allowed()
