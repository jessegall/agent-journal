from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.drivers.support.driver_nudges import LONG_OUTPUT

LONG_OUTPUT_LINE_COUNT = 400
TEXT_FIELDS = ("stdout", "content", "output")


class LongOutputRule(DriverRule):
    """A tool's long result stays in the context for every later turn, so the main agent is told how long it was."""

    name = "drivers.long-output"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def answer(self, hook: AgentHook) -> RuleAnswer:
        response = hook.event.raw.get("tool_response")
        text = response if isinstance(response, str) else next((response[name] for name in TEXT_FIELDS if isinstance(response, dict) and isinstance(response.get(name), str)), "")
        lines = text.count("\n")
        return RuleAnswer.with_nudges(LONG_OUTPUT.nudge(lines=lines)) if lines >= LONG_OUTPUT_LINE_COUNT else RuleAnswer.allowed()
