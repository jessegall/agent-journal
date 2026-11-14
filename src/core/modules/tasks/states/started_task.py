from collections.abc import Sequence

from engine.driver.agent_hook import AgentHook
from engine.driver.agent_state import AgentState
from engine.driver.open_row import OpenRow
from engine.enums.state_tier import StateTier
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery
from core.modules.tasks.rules.inactive_task_reminder_rule import InactiveTaskReminderRule
from core.modules.tasks.rules.log_request_rule import LogRequestRule
from core.modules.tasks.rules.task_name_rule import TaskNameRule
from core.modules.tasks.rules.task_return_line_rule import TaskReturnLineRule
from core.modules.tasks.rules.task_summary_line_rule import TaskSummaryLineRule
from core.modules.tasks.rules.unlogged_write_rule import UnloggedWriteRule


class StartedTask(AgentState):
    """An agent holds a started task: the task rules that have nothing to say without one are asked in their own
    place only then. The agent's newest started task opens it, read as the rules read it, so they share the read."""

    name = "tasks.task-started"
    tier = StateTier.IN_PLACE
    rules = [TaskReturnLineRule, LogRequestRule, UnloggedWriteRule, TaskNameRule, InactiveTaskReminderRule, TaskSummaryLineRule]

    def __init__(self, tasks: TaskQuery) -> None:
        self.tasks = tasks

    def open_rows(self, hook: AgentHook) -> Sequence[OpenRow]:
        return [OpenRow(Task.model_name, task.id, task.current_at()) for task in self.tasks.started_tasks(hook.agent_id)[:1]]
