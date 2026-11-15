from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from engine.enums.agent_role import AgentRole
from suites.coding.modules.workers.lines.stopped_worker_lines import StoppedWorkerLines


class StoppedWorkerRule(DriverRule):
    """The old walk's answer for StoppedWorkerLines, which owns it, until the walk is deleted."""

    name = StoppedWorkerLines.key
    hook = HookEventName.TICK
    drivers = ["coding.main"]
    roles = [AgentRole.MAIN]

    def __init__(self, lines: StoppedWorkerLines) -> None:
        self.lines = lines

    def answer(self, hook: AgentHook) -> RuleAnswer:
        nudges = self.lines.nudges(hook.event, hook.agent_id)
        return RuleAnswer.with_nudges(*nudges) if nudges else RuleAnswer.allowed()
