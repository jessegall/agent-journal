from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.conflict_files import ConflictFiles
from pathlib import Path
from core.base.command.handler import Handler
from core.base.listener.event_rows import EventRows
from core.base.refusal import Refusal
from core.base.scope.actor_scope import ActorScope
from core.modules.environments.models.environment import Environment
from core.modules.environments.support.environment_rows import EnvironmentRows
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.commands.merge_worker.merge_worker import MergeWorker
from suites.coding.modules.workers.commands.record_worktree_merge.record_worktree_merge import RecordWorktreeMerge
from suites.coding.modules.workers.commands.record_worktree_removal.record_worktree_removal import RecordWorktreeRemoval
from suites.coding.modules.workers.commands.support.worktree_commands import WorktreeCommands
from suites.coding.modules.workers.support.worker_settings import MERGE_COMMANDS, MERGE_COMMANDS_NAME
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from suites.coding.modules.workers.support.merge_outcome import MergeOutcome
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.merge_checks import MergeChecks

class MergeWorkerHandler(Handler[MergeWorker, MergeOutcome]):
    """Merges a checked worktree into its base branch in the environment's folder, in the order of doc 1101
    4.5. A moved base is rebased under the worker's uncommitted changes first; only a clash that stays goes
    back to the worker. The merge commands run before the task closes, so a failed one, such as a push, leaves
    the task open to merge again. Git runs outside any transaction, so its wait holds no write lock."""

    command = MergeWorker
    disabled_scopes = [ActorScope]
    transactional = False

    def __init__(self, rows: EventRows, worktrees: WorktreeQuery, checks: MergeChecks, git: WorktreeGit, environments: EnvironmentRows, bus: Bus, settings: SettingValues, commands: WorktreeCommands) -> None:
        self.rows, self.worktrees, self.checks, self.git = rows, worktrees, checks, git
        self.environments, self.bus, self.settings, self.commands = environments, bus, settings, commands

    def handle(self, command: MergeWorker, context: Context) -> MergeOutcome:
        worktree = self.worktrees.worker_worktree(command.worker_id)
        if worktree is None or worktree.state is not WorktreeState.DELIVERED:
            raise Refusal(f"worker {command.worker_id} has delivered nothing to merge", "journal worker-worktree list shows the worktrees")
        environment = self.environments.find(worktree.environment_id)
        self.check(worktree, environment)
        task = self.rows.required(Task, worktree.task_id)
        uncommitted = self.git.uncommitted_overlap(environment.folder, worktree)
        if uncommitted:
            raise Refusal(f"the checkout of environment {environment.name} has uncommitted changes to {', '.join(uncommitted)}",
                          f"worker {worktree.session_agent_id} changes them too: commit or stash them, then merge again")
        conflicts = self.git.rebased_commit(worktree, f"task {task.id}: {task.title}", f"Journal: worker worker-{worktree.session_agent_id}")
        if conflicts:
            return self.bus.run_with_context(RecordWorktreeMerge(worktree.id, conflicts), context)
        self.git.rebuild(worktree, environment.folder)
        commit_before_merge = self.git.tip(environment.folder, worktree.base_branch)
        self.git.merge(environment.folder, worktree, f"task {task.id}: {task.title}, from worker {worktree.session_agent_id}")
        self.commands.run(environment.folder, worktree.base_branch, self.settings.texts(MERGE_COMMANDS), (), MERGE_COMMANDS_NAME)
        merge_outcome =self.bus.run_with_context(RecordWorktreeMerge(worktree.id, (), commit_before_merge, self.git.tip(environment.folder, worktree.base_branch)), context)
        self.git.remove(environment.folder, merge_outcome.worktree)
        return MergeOutcome(self.bus.run_with_context(RecordWorktreeRemoval(worktree.id), context), ())

    def check(self, worktree: Worktree, environment: Environment) -> None:
        ConflictFiles(Path(environment.folder)).check()
        self.checks.check_proofs(worktree)
        self.checks.check_logs(worktree)
        self.checks.check_base_branch(worktree)
        head = self.git.head(environment.folder)
        if head != worktree.base_branch:
            raise Refusal(f"the checkout of environment {environment.name} is on {head}, not on {worktree.base_branch}; the merge waits until it is back",
                          f"switch the checkout back to {worktree.base_branch}, then merge again")
