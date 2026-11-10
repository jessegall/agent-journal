from core.modules.tasks.models.enums.task_state import TaskState
from core.base.actor import Actor
from core.base.command.bus import Bus
from core.base.query.queries import Queries
from engine.errors.refusal import Refusal
from core.modules.environments.models.environment import Environment
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.commands.record_worktree_base.record_worktree_base import RecordWorktreeBase
from suites.coding.models.enums.ask_topic import AskTopic
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.support.brief_points import brief_point_count
from suites.coding.modules.workers.support.task_branch_commit import TaskBranchCommit
from suites.coding.modules.workers.support.delivery_differences import is_none_answer
from suites.coding.modules.workers.support.worktree_changes import WorktreeChanges
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from suites.coding.modules.workers.support.protected_folders import ProtectedFolders

BUILT_HINT = 'prove each point and hand in with --differences "already built: <where>"'
UNCHANGED_TASK_HINT = 'make the change, block the task on what it waits for, or if it is already built hand in with --differences "<why no change was needed>"'


class WorkerTaskCommit:
    """Commits a worker's worktree for its current task on the latest of its base branch, once each point of
    the task's brief has a proof; a clash stops the hand-in with the conflict markers in the worktree. It
    runs before the hand-in's transaction opens, so git's wait holds no write lock."""

    def __init__(self, proofs: ProofQuery, git: WorktreeGit, queries: Queries, bus: Bus, protected: ProtectedFolders) -> None:
        self.proofs, self.git, self.queries, self.bus = proofs, git, queries, bus
        self.protected = protected

    def check_proofs(self, worktree: Worktree, task: Task) -> None:
        proved = {proof.point for proof in self.proofs.worktree_proofs(worktree.id).all_rows() if proof.task_id == task.id}
        unproved = [str(point) for point in range(1, brief_point_count(task.brief) + 1) if point not in proved]
        if unproved:
            raise Refusal(f"point {', '.join(unproved)} has no proof", AskTopic.GENERAL.hint(f"journal proof make {unproved[0]} --task {task.id} \"<file:line, and the test that shows it>\""))

    def commit(self, worktree: Worktree, task: Task, actor: Actor, differences: str) -> None:
        for path in self.git.uncommitted_files(worktree.folder):
            folder = self.protected.match(worktree.folder, path)
            if folder:
                raise Refusal(f"{folder} is protected", AskTopic.TOOL.hint("undo the change in that folder"))
        base_commit = self.git.tip(worktree.folder, worktree.base_branch)
        conflicts = self.git.rebased_commit(worktree, f"task {task.id}: {task.title}", f"Journal: worker worker-{worktree.session_agent_id}")
        if conflicts:
            raise Refusal(f"your work clashes with {worktree.base_branch} in {', '.join(conflicts)}", AskTopic.CONFLICT.hint("settle the conflict markers in those files, then hand in again"))
        current = worktree.moved(WorktreeLifecycle.advance, base_commit=base_commit)
        changes = self.git.comparison(current)
        if is_none_answer(differences):
            self.check_built(current, task, changes)
        self.git.refuse_deleted_built_files(current, changes)
        if base_commit != worktree.base_commit:
            self.git.rebuild(current, self.queries.query(Environment).find(worktree.environment_id).folder)
        self.bus.run(RecordWorktreeBase(worktree.id, base_commit), actor, environment_id=worktree.environment_id)

    def check_built(self, worktree: Worktree, task: Task, changes: WorktreeChanges) -> None:
        if not changes.files:
            raise Refusal("your worktree has no change", AskTopic.BUILT.hint(UNCHANGED_TASK_HINT))
        if task.state is not TaskState.STARTED:
            return
        commits = self.git.task_commits(worktree, task.id)
        if not any(commit.worker_id == worktree.session_agent_id for commit in commits):
            raise Refusal(f"task {task.id} changed no file, so it is not built", AskTopic.BUILT.hint(self.no_change_hint(commits)))

    @staticmethod
    def no_change_hint(commits: tuple[TaskBranchCommit, ...]) -> str:
        if not commits:
            return UNCHANGED_TASK_HINT
        workers = ", ".join(dict.fromkeys(str(commit.worker_id) for commit in commits))
        return f"the task already has commits {', '.join(commit.short_id for commit in commits)} from worker {workers}: {BUILT_HINT}"
