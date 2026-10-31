from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.rule_answer import RuleAnswer
from core.modules.tasks.tasks_in_hand import TasksInHand


class TaskSummaryLine(DriverRule):
    """A session that starts again with a task in hand, after a compaction or a resume, is told the task and its
    newest log line."""

    name = "tasks.session-start-summary"
    hook = "session_start"
    drivers = ["*"]
    roles = ["main"]

    def __init__(self, in_hand: TasksInHand) -> None:
        self.in_hand = in_hand

    def answer(self, hook: AgentHook) -> RuleAnswer:
        held = self.in_hand.of(hook.agent_id)
        if held is None:
            return RuleAnswer.allowed()
        logged = f"last log: {held.last_log.line}" if held.last_log is not None else "nothing logged yet"
        return RuleAnswer.with_lines(f"{held.name}, is in hand; {logged}")
