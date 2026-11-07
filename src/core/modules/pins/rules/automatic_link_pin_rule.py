from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.pins.rules.link_pin_rule import FILE_TOOLS
from core.modules.pins.support.link_pin_check import LinkPinCheck


class AutomaticLinkPinRule(DriverRule):
    """Pins design and pull request links returned by tools."""

    name = "pins.automatic-link"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]

    def __init__(self, check: LinkPinCheck) -> None:
        self.check = check

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is None:
            return RuleAnswer.allowed()
        if tool.category in FILE_TOOLS or (tool.shell is not None and tool.shell.is_readonly):
            return RuleAnswer.allowed()
        text = self.check.joined_text([hook.event.tool_input(), hook.event.raw.get("tool_response")])
        designs = self.check.design_pins(text)
        return RuleAnswer.allowed().running(*designs, *self.check.pull_request_pins(text))
