from collections.abc import Sequence

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.clock import Clock
from core.base.command.bus import Bus
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.environments.models.environment import Environment
from core.modules.plugins.support.plugin_step_check import PluginStepCheck
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.commands.record_worker_refusal.record_worker_refusal import RecordWorkerRefusal
from suites.coding.modules.workers.commands.clear_worker_refusals.clear_worker_refusals import ClearWorkerRefusals
from suites.coding.modules.workers.support.worktree_git import WorktreeGit

# The plugin events of a worker handing a task's work over for testing, which worker next and worker deliver both do.
DELIVERY_EVENTS = ("worker_clocking_out", "worker_delivering")


class WorkerStepCheck:
    """Checks plugin rules against a worker's checkout and recorded base commit before a handoff or merge."""

    def __init__(self, step_check: PluginStepCheck, git: WorktreeGit, queries: Queries, clock: Clock, bus: Bus) -> None:
        self.step_check, self.git, self.queries, self.clock, self.bus = step_check, git, queries, clock, bus

    def check(self, worktree: Worktree, events: Sequence[str], hint: str) -> None:
        data = {"worker": worktree.agent_id, "task": worktree.task_id, "branch": worktree.branch, "base": worktree.base_commit,
                "worktree": worktree.folder, "files": list(self.git.changed_files(worktree))}
        environment = self.queries.query(Environment).find(worktree.environment_id).name
        for event in events:
            refusal = self.step_check.refusal(event, data, environment, self.clock.timestamp(), worktree.agent_id)
            if refusal:
                if event in DELIVERY_EVENTS:
                    self.bus.run(RecordWorkerRefusal(worktree.id, refusal), Actor(worktree.agent_id, ActorType.AGENT), environment_id=worktree.environment_id)
                raise Refusal(refusal, hint)
        if any(event in DELIVERY_EVENTS for event in events):
            self.bus.run(ClearWorkerRefusals(worktree.id), Actor(worktree.agent_id, ActorType.AGENT), environment_id=worktree.environment_id)
