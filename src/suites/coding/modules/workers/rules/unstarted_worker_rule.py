from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.rules.support.worker_worktrees import WorkerWorktrees
from suites.coding.modules.workers.support.worker_nudges import WORKER_UNSTARTED
from engine.enums.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.interval import Interval
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.span_queries import SpanQueries
from core.base.scope.actor_scope import ActorScope
from core.modules.drivers.models.agent_activity import AgentActivity
from core.modules.drivers.support.agent_activities import AgentActivities
from core.modules.settings.bindings.support.setting_values import SettingValues
from suites.coding.modules.workers.support.worker_settings import UNSTARTED_WORKER_SECONDS


class UnstartedWorkerRule(DriverRule):
    """A tick tells the main agent of each worker whose program has made no hook call within the unstarted
    worker seconds of its dispatch, so a program that was refused at its start is seen at once."""

    name = "workers.unstarted-worker"
    hook = HookEventName.TICK
    drivers = ["coding.main"]
    roles = [AgentRole.MAIN]
    disabled_scopes = [ActorScope]

    def __init__(self, worktrees: WorkerWorktrees, activities: AgentActivities, settings: SettingValues, spans: SpanQueries) -> None:
        self.worktrees, self.activities, self.settings, self.spans = worktrees, activities, settings, spans

    def answer(self, hook: AgentHook) -> RuleAnswer:
        activities = self.activities.read(hook)
        workers = [activities[worktree.session_agent_id] for worktree in self.worktrees.main_worktrees() if worktree.state is WorktreeState.CUT and worktree.session_agent_id in activities]
        limit = Interval(self.settings.seconds(UNSTARTED_WORKER_SECONDS))
        return RuleAnswer.with_nudges(*(WORKER_UNSTARTED.nudge(worker=worker.id, seconds=limit.seconds) for worker in workers if self.is_unstarted(worker, hook, limit)))

    def is_unstarted(self, worker: AgentActivity, hook: AgentHook, limit: Interval) -> bool:
        return worker.ended_at is None and limit.has_passed(self.spans, hook.agent_id, worker.created_at, hook.timestamp) and worker.last_hook_at is None
