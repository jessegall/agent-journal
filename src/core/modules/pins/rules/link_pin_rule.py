from engine.enums.agent_role import AgentRole
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.pins.support.link_pin_check import LinkPinCheck


class LinkPinRule(DriverRule):
    """A link in a tool's output or in the line the agent ran is offered as a pin, and words in that line that a link
    is pinned are checked; a file the agent reads or edits is not offered from."""

    name = "pins.link-pin"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, check: LinkPinCheck) -> None:
        self.check = check

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is None or self.check.is_file_read_tool(tool):
            return RuleAnswer.allowed()
        part_nudges = [nudge for part_text in (tool.shell.part_texts if tool.shell is not None else ()) for nudge in self.check.nudges(part_text)]
        response = self.check.joined_text(hook.event.raw.get("tool_response"))
        return RuleAnswer.with_nudges(*part_nudges, *self.check.nudges("", response))
