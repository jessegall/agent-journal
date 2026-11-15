from suites.coding.modules.workers.types.worker import Worker
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from suites.coding.modules.workers.lines.worker_log_due_lines import WorkerLogDueLines


class WorkerLogDueRule(DriverRule):
    """The old walk's answer for WorkerLogDueLines, which owns it, until the walk is deleted."""

    name = WorkerLogDueLines.key
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]
    roles = [Worker.key]

    def __init__(self, lines: WorkerLogDueLines) -> None:
        self.lines = lines

    def answer(self, hook: AgentHook) -> RuleAnswer:
        nudges = self.lines.nudges(hook.event, hook.agent_id)
        return RuleAnswer.with_nudges(*nudges) if nudges else RuleAnswer.allowed()
