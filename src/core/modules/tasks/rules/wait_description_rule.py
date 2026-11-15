from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from core.modules.tasks.lines.wait_in_words_lines import WaitInWordsLines


class WaitDescriptionRule(DriverRule):
    """The old walk's answer for WaitInWordsLines, which owns it, until the walk is deleted."""

    name = WaitInWordsLines.key
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]

    def __init__(self, lines: WaitInWordsLines) -> None:
        self.lines = lines

    def answer(self, hook: AgentHook) -> RuleAnswer:
        nudges = self.lines.nudges(hook.event, hook.agent_id)
        return RuleAnswer.with_nudges(*nudges) if nudges else RuleAnswer.allowed()
