from collections.abc import Sequence
from engine.driver.nudge import Nudge
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_line_source import EventLineSource
from core.modules.tasks.nudges.missed_log_nudge import MissedLogNudge
from core.modules.tasks.nudges.current_task_nudge import CurrentTaskNudge
from engine.enums.hook_event_name import HookEventName
from core.modules.tasks.support.current_tasks import CurrentTasks
from engine.enums.agent_role import AgentRole


class SessionStartSummaryLines(EventLineSource):
    """A session that starts again with a task in hand, after a compaction, is told the task
    and its newest log line."""

    key = "tasks.session-start-summary"
    events = [HookEventName.SESSION_START]
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, current_tasks: CurrentTasks) -> None:
        self.current_tasks = current_tasks

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[Nudge]:
        current = self.current_tasks.current(agent_id)
        if current is None:
            return []
        return [CurrentTaskNudge.declared().nudge(task=current.task.id), MissedLogNudge.declared().nudge(task=current.task.id)]
