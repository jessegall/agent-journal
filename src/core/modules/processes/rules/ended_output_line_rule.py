from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_wildcard import HookWildcard
from core.modules.processes.lines.ended_output_line_lines import EndedOutputLineLines


class EndedOutputLineRule(DriverRule):
    """The old walk's answer for EndedOutputLineLines, which owns it, until the walk is deleted."""

    name = EndedOutputLineLines.key
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    history = True

    def __init__(self, lines: EndedOutputLineLines) -> None:
        self.lines = lines

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.with_nudges(*self.lines.nudges(hook.event, hook.agent_id))
