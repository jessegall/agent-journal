from collections.abc import Sequence

from core.base.clock import Clock
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.environments.models.environment import Environment
from core.modules.plugins.support.plugin_step_check import PluginStepCheck
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.worktree_git import WorktreeGit


class WorkerStepCheck:
    """Asks the plugins that answer a worker's step before its command is sent, outside the write the command
    makes: the worker, its task, branch and worktree folder and the files it changed; a refusal stops the step
    with the plugin's reason."""

    def __init__(self, step_check: PluginStepCheck, git: WorktreeGit, queries: Queries, clock: Clock) -> None:
        self.step_check, self.git, self.queries, self.clock = step_check, git, queries, clock

    def check(self, worktree: Worktree, events: Sequence[str], hint: str) -> None:
        data = {"worker": worktree.agent_id, "task": worktree.task_id, "branch": worktree.branch, "worktree": worktree.folder,
                "files": list(self.git.changed_files(worktree))}
        environment = self.queries.query(Environment).find(worktree.environment_id).name
        for event in events:
            refusal = self.step_check.refusal(event, data, environment, self.clock.timestamp())
            if refusal:
                raise Refusal(refusal, hint)
