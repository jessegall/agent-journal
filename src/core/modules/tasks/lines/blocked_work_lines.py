from collections.abc import Sequence

from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from engine.enums.line_channel import LineChannel
from core.modules.tasks.agent_messages.blocked_tasks_message import BlockedTasksMessage
from core.modules.tasks.queries.task_query import TaskQuery
from core.modules.tasks.support.current_tasks import CurrentTasks
from core.modules.tasks.support.suite_task_assigners import SuiteTaskAssigners


class BlockedWorkLines(EventLineSource):
    """A stop of the main agent with nothing in hand and nothing open, while tasks of the environment are
    blocked, names them on the held carrier (doc 1310 section 10.3), once: not again until the agent has used
    a tool since."""

    key = "tasks.blocked-work-at-stop"
    events = [HookEventName.STOP]
    agent_types = [AgentRole.MAIN.value]
    channel = LineChannel.WAITING

    def __init__(self, tasks: TaskQuery, current: CurrentTasks, assigners: SuiteTaskAssigners) -> None:
        self.tasks, self.current, self.assigners = tasks, current, assigners

    def agent_messages(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        # started tasks are checked by the task stop rule, and open ones by the main agent's stop rule
        if self.current.started_tasks(agent_id) or self.tasks.open_tasks().exists():
            return []
        assigner = self.assigners.assigner()
        blocked = assigner.blocked_tasks() if assigner is not None else ()
        if not blocked:
            return []
        return [BlockedTasksMessage.declared().agent_message(tasks=', '.join(str(task_id) for task_id in blocked))]
