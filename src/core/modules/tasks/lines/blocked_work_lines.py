from collections.abc import Sequence

from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.driver.hook_event import HookEvent
from engine.driver.nudge import Nudge
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from engine.enums.line_carrier import LineCarrier
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.tasks.nudges.blocked_tasks_nudge import BlockedTasksNudge
from core.modules.tasks.queries.task_query import TaskQuery
from core.modules.tasks.rules.support.current_tasks import CurrentTasks
from core.modules.tasks.support.suite_task_assigners import SuiteTaskAssigners


class BlockedWorkLines(EventLineSource):
    """A stop of the main agent with nothing in hand and nothing open, while tasks of the environment are blocked,
    names them once; the next stop goes through."""

    key = "tasks.blocked-work-at-stop"
    events = [HookEventName.STOP]
    agent_types = [AgentRole.MAIN.value]
    carrier = LineCarrier.WAITING

    def __init__(self, tasks: TaskQuery, calls: HookCallQuery, current: CurrentTasks, assigners: SuiteTaskAssigners) -> None:
        self.tasks, self.calls, self.current, self.assigners = tasks, calls, current, assigners

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[Nudge]:
        # started tasks are checked by the task stop rule, and open ones by the main agent's stop rule
        if self.current.started_tasks(agent_id) or self.tasks.open_tasks().exists():
            return []
        assigner = self.assigners.assigner()
        blocked = assigner.blocked_tasks() if assigner is not None else ()
        if not blocked or self.calls.last_stop_refused(agent_id):
            return []
        return [BlockedTasksNudge.declared().nudge(tasks=', '.join(str(task_id) for task_id in blocked))]
