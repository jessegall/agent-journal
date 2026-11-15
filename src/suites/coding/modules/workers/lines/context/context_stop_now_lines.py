from collections.abc import Sequence

from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.agent_machine.needs.line_history import LineHistory
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.driver.seconds import Seconds
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from engine.time.clock import Clock
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.modules.workers.agent_messages.task_end_context_stop_message import TaskEndContextStopMessage
from suites.coding.modules.workers.agent_messages.context_stop_immediate_message import ContextStopImmediateMessage
from suites.coding.modules.workers.support.worker_compaction import WorkerCompaction
from suites.coding.modules.workers.types.worker import Worker
from suites.coding.support.context_limit_check import ContextLimitCheck

RETRY_SECONDS = Seconds(600)


class ContextStopNowLines(EventLineSource):
    """An agent whose context has reached the token limit and that holds no task, or a worker just handed its next
    task, is told to stop, so that its stop compacts it; the first is told again only ten minutes later."""

    key = "workers.context-limit-stop-now"
    events = [HookEventName.POST_TOOL_USE]
    agent_types = [AgentRole.MAIN.value, Worker.key]

    def __init__(self, history: LineHistory, limit_check: ContextLimitCheck, tasks: TaskQuery, compaction: WorkerCompaction, clock: Clock) -> None:
        self.history, self.limit_check, self.tasks, self.compaction, self.clock = history, limit_check, tasks, compaction, clock

    def agent_messages(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        if self.compaction.is_after_task(agent_id):
            return [TaskEndContextStopMessage.declared().agent_message()]
        if self.limit_check.tokens(agent_id) is None or self.tasks.started_tasks(agent_id) or self.spoke_recently(agent_id):
            return []
        return [ContextStopImmediateMessage.declared().agent_message()]

    def spoke_recently(self, agent_id: int) -> bool:
        spoke_at = self.history.last_spoke(self.key, agent_id)
        return spoke_at is not None and spoke_at.elapsed_seconds(self.clock.timestamp()) < RETRY_SECONDS.count
