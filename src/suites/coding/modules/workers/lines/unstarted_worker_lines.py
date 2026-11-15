from collections.abc import Sequence

from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.cli.row_numbers import RowNumbers
from engine.driver.hook_event import HookEvent
from engine.driver.interval import Interval
from engine.driver.agent_message import AgentMessage
from engine.driver.span_queries import SpanQueries
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from engine.setting.setting_values import SettingValues
from engine.time.clock import Clock
from core.modules.drivers.models.agent_activity import AgentActivity
from core.modules.drivers.support.agent_activities import AgentActivities
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.nudges.worker_unstarted_message import WorkerUnstartedMessage
from suites.coding.modules.workers.support.worker_worktrees import WorkerWorktrees
from suites.coding.modules.workers.support.worker_settings import UNSTARTED_WORKER_SECONDS


class UnstartedWorkerLines(EventLineSource):
    """At its minute step the main agent is told of each worker whose program has made no hook call within the
    unstarted worker seconds of its dispatch, so a program that was refused at its start is seen at once."""

    key = "workers.unstarted-worker"
    events = [HookEventName.TICK]
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, worktrees: WorkerWorktrees, activities: AgentActivities, settings: SettingValues, spans: SpanQueries, numbers: RowNumbers, clock: Clock) -> None:
        self.worktrees, self.activities, self.settings, self.spans, self.numbers, self.clock = worktrees, activities, settings, spans, numbers, clock

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        activities = self.activities.read(event, agent_id)
        workers = [activities[worktree.session_agent_id] for worktree in self.worktrees.main_worktrees() if worktree.state is WorktreeState.CUT and worktree.session_agent_id in activities]
        limit = Interval(self.settings.seconds(UNSTARTED_WORKER_SECONDS))
        return [WorkerUnstartedMessage.declared().nudge(worker=self.numbers.number(AGENT_MODEL_NAME, worker.id), seconds=limit.seconds) for worker in workers if self.is_unstarted(worker, agent_id, limit)]

    def is_unstarted(self, worker: AgentActivity, agent_id: int, limit: Interval) -> bool:
        return worker.ended_at is None and limit.has_passed(self.spans, agent_id, worker.created_at, self.clock.timestamp()) and worker.last_hook_at is None
