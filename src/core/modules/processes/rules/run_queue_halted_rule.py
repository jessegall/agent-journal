from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_wildcard import HookWildcard
from engine.enums.agent_role import AgentRole
from core.modules.processes.lines.run_queue_halted_lines import RunQueueHaltedLines


class RunQueueHaltedRule(DriverRule):
    """The old walk's answer for RunQueueHaltedLines, which owns it, until the walk is deleted."""

    name = RunQueueHaltedLines.key
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, lines: RunQueueHaltedLines) -> None:
        self.lines = lines

    def answer(self, hook: AgentHook) -> RuleAnswer:
        nudges = self.lines.nudges(hook.event, hook.agent_id)
        return RuleAnswer.with_nudges(*nudges) if nudges else RuleAnswer.allowed()
