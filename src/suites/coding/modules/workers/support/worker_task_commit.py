from core.modules.tasks.models.enums.task_state import TaskState
from core.base.actor import Actor
from core.base.command.bus import Bus
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.environments.models.environment import Environment
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.commands.record_worktree_base.record_worktree_base import RecordWorktreeBase
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.support.brief_points import brief_point_count
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from suites.coding.modules.workers.support.protected_folders import ProtectedFolders


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
            raise Refusal(f"point {', '.join(unproved)} has no proof", f"journal proof make {unproved[0]} --task {task.id} \"<file:line, and the test that shows it>\"")
    def commit(self, worktree: Worktree, task: Task, actor: Actor) -> None:
        for path in self.git.changed_files(worktree):
            folder = self.protected.match(worktree.folder, path)
            if folder:
                raise Refusal(f"{folder} is protected", "report the change to the main agent")
        base_commit = self.git.tip(worktree.folder, worktree.base_branch)
        conflicts = self.git.rebased_commit(worktree, f"task {task.id}: {task.title}", f"Journal: worker worker-{worktree.session_agent_id}")
        if conflicts:
            raise Refusal(f"your work clashes with {worktree.base_branch} in {', '.join(conflicts)}", "settle the conflict markers in those files, then hand in again")
        current = worktree.moved(WorktreeLifecycle.advance, base_commit=base_commit)
        if not self.git.changed_files(current):
            raise Refusal("your worktree has no change", "make the change, or say in a proof why none is needed and ask for release")
        if task.state is TaskState.STARTED and not self.git.has_task_commit(current, task.id):
            raise Refusal(f"task {task.id} changed no file, so it is not built",
                          f"block it on what it waits for with journal task block {task.id} --on task:<n>, or tell the main agent with journal worker report")
        if base_commit != worktree.base_commit:
            self.git.rebuild(current, self.queries.query(Environment).find(worktree.environment_id).folder)
        self.bus.run(RecordWorktreeBase(worktree.id, base_commit), actor, environment_id=worktree.environment_id)
