from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.rule_answer import RuleAnswer
from core.modules.tasks.current_tasks import CurrentTasks


class TaskSummaryLineRule(DriverRule):
    """A session that starts again with a task in hand, after a compaction or a resume, is told the task and its
    newest log line."""

    name = "tasks.session-start-summary"
    hook = "session_start"
    drivers = ["*"]
    roles = ["main"]

    def __init__(self, current_tasks: CurrentTasks) -> None:
        self.current_tasks = current_tasks

    def answer(self, hook: AgentHook) -> RuleAnswer:
        current = self.current_tasks.current(hook.agent_id)
        if current is None:
            return RuleAnswer.allowed()
        logged = f"last log: {current.last_log.line}" if current.last_log is not None else "nothing logged yet"
        return RuleAnswer.with_lines(f"{current.name}, is in hand; {logged}")
