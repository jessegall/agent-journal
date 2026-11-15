from collections.abc import Sequence
from engine.driver.nudge import Nudge
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_line_source import EventLineSource
import re

from engine.enums.hook_event_name import HookEventName
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from core.modules.tasks.models.enums.task_state import UNFINISHED_STATES
from core.modules.tasks.models.task import Task
from core.modules.tasks.rules.support.current_tasks import CurrentTasks
from core.modules.tasks.nudges.task_name_nudge import TaskNameNudge


TASK_MOVES = ("task start", "task close", "task cancel", "task block", "task release")
TASK_NUMBER = re.compile(r"\btasks? (\d+)\b", re.I)


class TaskNameLines(EventLineSource):
    """A task newly in hand whose brief names another unfinished task is told how to block on it."""

    key = "tasks.named-task"
    events = [HookEventName.POST_TOOL_USE]

    def __init__(self, queries: Queries, current_tasks: CurrentTasks) -> None:
        self.queries, self.current_tasks = queries, current_tasks

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[Nudge]:
        shell = event.tool.shell if event.tool is not None else None
        current = self.current_tasks.current(agent_id) if shell is not None and shell.parts_running_journal_command(*TASK_MOVES) else None
        if current is None:
            return []
        numbers = {int(number) for number in TASK_NUMBER.findall(current.task.brief)} - {current.task.id}
        labelled = self.queries.query(Task).matching(Among("id", tuple(numbers))).matching(Among("state", UNFINISHED_STATES)).oldest().get() if numbers else ()
        return [*(TaskNameNudge.declared().nudge(task=current.task.id, other=task.id) for task in labelled)]
