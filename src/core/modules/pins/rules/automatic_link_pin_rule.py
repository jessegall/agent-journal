from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.pins.support.link_pin_check import LinkPinCheck


class AutomaticLinkPinRule(DriverRule):
    """Pins pull request links returned by tools; a design link waits for its designer's report."""

    name = "pins.automatic-link"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]

    def __init__(self, check: LinkPinCheck) -> None:
        self.check = check

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is None:
            return RuleAnswer.allowed()
        if self.check.is_file_read_tool(tool):
            return RuleAnswer.allowed()
        text = self.check.joined_text([hook.event.tool_input(), hook.event.raw.get("tool_response")])
        return RuleAnswer.allowed().running(*self.check.change_request_pins(text))
