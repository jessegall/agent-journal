from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.rules.support.worker_worktrees import WorkerWorktrees
from suites.coding.modules.workers.support.worker_nudges import WORKER_UNSTARTED
from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.scope.actor_scope import ActorScope
from core.modules.drivers.models.agent_activity import AgentActivity
from core.modules.drivers.support.agent_activities import AgentActivities

START_SECONDS = 60


class UnstartedWorkerRule(DriverRule):
    """A tick tells the main agent of each worker whose program has made no hook call a minute after its
    dispatch, so a program that was refused at its start is seen at once."""

    name = "workers.unstarted-worker"
    hook = HookEventName.TICK
    drivers = ["coding.main"]
    roles = [AgentRole.MAIN]
    disabled_scopes = [ActorScope]

    def __init__(self, worktrees: WorkerWorktrees, activities: AgentActivities) -> None:
        self.worktrees, self.activities = worktrees, activities

    def answer(self, hook: AgentHook) -> RuleAnswer:
        activities = self.activities.read(hook)
        workers = [activities[worktree.session_agent_id] for worktree in self.worktrees.main_worktrees() if worktree.state is WorktreeState.CUT]
        return RuleAnswer.with_nudges(*(WORKER_UNSTARTED.nudge(worker=worker.id, seconds=START_SECONDS) for worker in workers if self.is_unstarted(worker, hook)))

    def is_unstarted(self, worker: AgentActivity, hook: AgentHook) -> bool:
        started_at = worker.created_at
        return worker.ended_at is None and started_at.elapsed_seconds(hook.timestamp) >= START_SECONDS and worker.last_hook_at is None
