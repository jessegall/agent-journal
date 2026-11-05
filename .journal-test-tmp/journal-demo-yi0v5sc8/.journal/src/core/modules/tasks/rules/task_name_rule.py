import re

from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.modules.tasks.models.enums.task_state import UNFINISHED_STATES
from core.modules.tasks.models.task import Task
from core.modules.tasks.rules.support.current_tasks import CurrentTasks
from core.modules.tasks.support.task_nudges import TASK_NAME


TASK_MOVES = ("task start", "task close", "task cancel", "task block", "task release")
TASK_NUMBER = re.compile(r"\btasks? (\d+)\b", re.I)


class TaskNameRule(DriverRule):
    """A task newly in hand whose brief names another unfinished task is told how to block on it."""

    name = "tasks.named-task"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]

    def __init__(self, queries: Queries, current_tasks: CurrentTasks) -> None:
        self.queries, self.current_tasks = queries, current_tasks

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        current = self.current_tasks.current(hook.agent_id) if shell is not None and shell.parts_running_journal_command(*TASK_MOVES) else None
        if current is None:
            return RuleAnswer.allowed()
        numbers = {int(number) for number in TASK_NUMBER.findall(current.task.brief)} - {current.task.id}
        labelled = self.queries.query(Task).matching(Among("id", tuple(numbers))).matching(Among("state", UNFINISHED_STATES)).oldest().all_rows() if numbers else ()
        return RuleAnswer.with_nudges(*(TASK_NAME.nudge(task=current.task.id, other=task.id) for task in labelled))
