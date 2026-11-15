from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from core.modules.processes.lines.alias_suggestion_lines import AliasSuggestionLines


class AliasSuggestionRule(DriverRule):
    """The old walk's answer for AliasSuggestionLines, which owns it, until the walk is deleted."""

    name = AliasSuggestionLines.key
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]

    def __init__(self, lines: AliasSuggestionLines) -> None:
        self.lines = lines

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.with_nudges(*self.lines.nudges(hook.event, hook.agent_id))
