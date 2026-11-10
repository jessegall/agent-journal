from core.modules.tasks.support.task_nudges import MISSED_LOG, CURRENT_TASK
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.tasks.rules.support.current_tasks import CurrentTasks
from engine.enums.agent_role import AgentRole


class TaskSummaryLineRule(DriverRule):
    """A session that starts again with a task in hand, after a compaction, is told the task
    and its newest log line."""

    name = "tasks.session-start-summary"
    start_line_rule = True
    hook = HookEventName.SESSION_START
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, current_tasks: CurrentTasks) -> None:
        self.current_tasks = current_tasks

    def answer(self, hook: AgentHook) -> RuleAnswer:
        current = self.current_tasks.current(hook.agent_id)
        if current is None:
            return RuleAnswer.allowed()
        return RuleAnswer.with_nudges(CURRENT_TASK.nudge(task=current.task.id), MISSED_LOG.nudge(task=current.task.id))
