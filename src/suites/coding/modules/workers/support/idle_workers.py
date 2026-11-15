from engine.driver.hook_event import HookEvent
from engine.enums.duration_unit import DurationUnit
from engine.request.request_values import RequestValues
from engine.setting.setting_values import SettingValues
from engine.time.clock import Clock
from core.modules.drivers.models.agent_activity import AgentActivity
from core.modules.drivers.support.agent_activities import AgentActivities
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.worker_worktrees import WorkerWorktrees
from suites.coding.modules.workers.support.worker_settings import WORKER_IDLE_HOURS


class IdleWorkers:
    """The worktrees of the main agent's workers that have used no tool for the hours the setting gives and have
    delivered nothing: read once a step, so the lines that name them and the effect that stops them agree."""

    def __init__(self, worktrees: WorkerWorktrees, activities: AgentActivities, settings: SettingValues, clock: Clock, request_values: RequestValues) -> None:
        self.worktrees, self.activities, self.settings, self.clock, self.request_values = worktrees, activities, settings, clock, request_values

    def idle(self, event: HookEvent | None, agent_id: int) -> list[Worktree]:
        event_id = event.event_id if event is not None else "step"
        return self.request_values.read(f"workers.idle:{agent_id}:{event_id}", lambda: event_id, lambda: self.found(event, agent_id))

    def found(self, event: HookEvent | None, agent_id: int) -> list[Worktree]:
        hours = self.settings.number(WORKER_IDLE_HOURS)
        activities = self.activities.read(event, agent_id)
        return [worktree for worktree in self.worktrees.main_worktrees()
                if worktree.state is WorktreeState.CUT and worktree.session_agent_id in activities and self.is_idle(activities[worktree.session_agent_id], hours)]

    def is_idle(self, worker: AgentActivity, hours: int) -> bool:
        return worker.ended_at is None and worker.is_inactive(self.clock.timestamp(), hours * DurationUnit.HOUR.seconds)
