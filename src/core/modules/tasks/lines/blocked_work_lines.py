from collections.abc import Sequence

from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.agent_machine.states.line_history import LineHistory
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from engine.enums.line_channel import LineChannel
from core.modules.drivers.queries.hook_call_query import HookCallQuery
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

    def __init__(self, tasks: TaskQuery, calls: HookCallQuery, current: CurrentTasks, assigners: SuiteTaskAssigners, history: LineHistory) -> None:
        self.tasks, self.calls, self.current, self.assigners, self.history = tasks, calls, current, assigners, history

    def agent_messages(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        # started tasks are checked by the task stop rule, and open ones by the main agent's stop rule
        if self.current.started_tasks(agent_id) or self.tasks.open_tasks().exists():
            return []
        assigner = self.assigners.assigner()
        blocked = assigner.blocked_tasks() if assigner is not None else ()
        if not blocked or self.told_since_last_tool(agent_id):
            return []
        return [BlockedTasksMessage.declared().agent_message(tasks=', '.join(str(task_id) for task_id in blocked))]

    def told_since_last_tool(self, agent_id: int) -> bool:
        spoke_at = self.history.last_spoke(self.key, agent_id)
        return spoke_at is not None and self.calls.tool_use_counts(agent_id, [spoke_at])[0] == 0
