from collections.abc import Sequence

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.agent_checkouts import AgentCheckouts
from core.base.clock import Clock
from core.base.command.bus import Bus
from core.modules.environments.support.environment_rows import EnvironmentRows
from core.base.refusal import Refusal
from core.modules.plugins.support.plugin_step_check import PluginStepCheck
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.commands.record_worker_refusal.record_worker_refusal import RecordWorkerRefusal
from suites.coding.modules.workers.commands.clear_worker_refusals.clear_worker_refusals import ClearWorkerRefusals
from suites.coding.modules.workers.support.worktree_git import WorktreeGit

# The plugin events of a worker handing a task's work over for testing, which worker next and worker deliver both do.
DELIVERY_EVENTS = ("worker_clocking_out", "worker_delivering")


class WorkerStepCheck:
    """Checks plugin rules against a worker's changes since its merge base before a handoff or merge."""

    def __init__(self, step_check: PluginStepCheck, git: WorktreeGit, environments: EnvironmentRows, clock: Clock, bus: Bus, checkouts: AgentCheckouts) -> None:
        self.step_check, self.git, self.environments, self.clock, self.bus, self.checkouts = step_check, git, environments, clock, bus, checkouts

    def check(self, worktree: Worktree, events: Sequence[str], hint: str) -> None:
        changes = self.git.comparison(worktree)
        checkout = self.checkouts.checkout(worktree.session_agent_id)
        data = {"worker": worktree.session_agent_id, "task": worktree.task_id, "branch": worktree.branch, "base": changes.base,
                "worktree": worktree.folder, "files": list(changes.files), "changes": [change.checkout_file(checkout).values() for change in changes.changes]}
        environment = self.environments.find(worktree.environment_id)
        for event in events:
            refusal = self.step_check.refusal(event, data, environment, self.clock.timestamp(), worktree.session_agent_id)
            if refusal:
                if event in DELIVERY_EVENTS:
                    self.bus.run(RecordWorkerRefusal(worktree.id), Actor(worktree.session_agent_id, ActorType.AGENT), environment_id=worktree.environment_id)
                raise Refusal(refusal, hint)
        if any(event in DELIVERY_EVENTS for event in events):
            self.bus.run(ClearWorkerRefusals(worktree.id), Actor(worktree.session_agent_id, ActorType.AGENT), environment_id=worktree.environment_id)
