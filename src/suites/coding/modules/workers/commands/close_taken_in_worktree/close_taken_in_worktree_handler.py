from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.rows.event_rows import EventRows
from engine.scope.actor_scope import ActorScope
from core.modules.environments.support.environment_rows import EnvironmentRows
from suites.coding.modules.workers.commands.close_taken_in_worktree.close_taken_in_worktree import CloseTakenInWorktree
from suites.coding.modules.workers.commands.record_worktree_merge.record_worktree_merge import RecordWorktreeMerge
from suites.coding.modules.workers.commands.record_worktree_removal.record_worktree_removal import RecordWorktreeRemoval
from suites.coding.modules.workers.commands.send_worker.support.worker_queued_start import WorkerQueuedStart
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.worktree_git import WorktreeGit

TAKEN_IN_TEXT = "merged into {branch}: its branch had no commit ahead of {branch}, so its work was there already and no merger was sent"


class CloseTakenInWorktreeHandler(Handler[CloseTakenInWorktree, bool]):
    """Reads whether a delivered worktree's branch has a commit ahead of its base; with none it closes the
    delivered tasks as merged with that reason, removes the worktree as a merge does and starts the worker on
    its next task. Git runs outside any transaction, so its wait holds no write lock."""

    command = CloseTakenInWorktree
    runs_once = True
    disabled_scopes = [ActorScope]

    def __init__(self, rows: EventRows, git: WorktreeGit, environments: EnvironmentRows, bus: Bus, queued_start: WorkerQueuedStart) -> None:
        self.rows, self.git, self.environments, self.bus, self.queued_start = rows, git, environments, bus, queued_start

    def handle(self, command: CloseTakenInWorktree, context: Context) -> bool:
        worktree = self.rows.required(Worktree, command.worktree_id)
        environment = self.environments.find(worktree.environment_id)
        if worktree.state is not WorktreeState.DELIVERED or not self.git.is_merged(environment.folder, worktree.base_branch, worktree.branch):
            return False
        base_commit = self.git.tip(environment.folder, worktree.base_branch)
        reason = TAKEN_IN_TEXT.format(branch=worktree.base_branch)
        merged = self.bus.run_with_context(RecordWorktreeMerge(worktree.id, (), base_commit, base_commit, reason), context).worktree
        self.git.remove(environment.folder, merged)
        self.bus.run_with_context(RecordWorktreeRemoval(merged.id), context)
        self.queued_start.start(merged.session_agent_id, context)
        return True
