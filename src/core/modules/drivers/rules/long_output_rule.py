from engine.enums.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from engine.types.type_guards import is_mapping
from core.modules.drivers.support.driver_nudges import LONG_OUTPUT

LONG_OUTPUT_LINE_COUNT = 400
TEXT_FIELDS = ("stdout", "content", "output")
RESPONSE_FILE_FIELD = "file"


class LongOutputRule(DriverRule):
    """A tool's long result stays in the context for every later turn, so the main agent is told how long it
    was."""

    name = "drivers.long-output"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def answer(self, hook: AgentHook) -> RuleAnswer:
        lines = self.text(hook.event.raw.get("tool_response")).count("\n")
        return RuleAnswer.with_nudges(LONG_OUTPUT.nudge(lines=lines)) if lines >= LONG_OUTPUT_LINE_COUNT else RuleAnswer.allowed()

    @classmethod
    def text(cls, response: object) -> str:
        if isinstance(response, str):
            return response
        if not is_mapping(response):
            return ""
        if RESPONSE_FILE_FIELD in response:
            return cls.text(response[RESPONSE_FILE_FIELD])
        return next((text for text in (response[name] for name in TEXT_FIELDS if name in response) if isinstance(text, str)), "")
