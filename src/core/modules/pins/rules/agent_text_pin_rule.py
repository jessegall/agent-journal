from engine.enums.agent_role import AgentRole
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.pins.support.link_pin_check import LinkPinCheck


class AgentTextPinRule(DriverRule):
    """A link in the text the agent finished writing is offered as a pin, and words there that a link is pinned are
    checked."""

    name = "pins.agent-text-pin"
    hook = HookEventName.MESSAGE_DISPLAY
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, check: LinkPinCheck) -> None:
        self.check = check

    def answer(self, hook: AgentHook) -> RuleAnswer:
        text = hook.event.raw.get("delta")
        if hook.event.raw.get("final") is not True or not isinstance(text, str):
            return RuleAnswer.allowed()
        return RuleAnswer.with_nudges(*self.check.nudges(text)).running(*self.check.change_request_pins(text))
