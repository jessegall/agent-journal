from core.base.command.context import Context
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.environments.models.environment import Environment
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.support.brief_points import brief_point_count
from suites.coding.modules.workers.support.worktree_git import WorktreeGit


class WorkerTaskCommit:
    """Commits a worker's worktree for its current task on the latest of its base branch, once each point of the
    task's brief has a proof; a clash stops the hand-in with the conflict markers in the worktree."""

    def __init__(self, proofs: ProofQuery, git: WorktreeGit, queries: Queries, repository: Repository) -> None:
        self.proofs, self.git, self.queries, self.repository = proofs, git, queries, repository

    def commit(self, worktree: Worktree, task: Task, context: Context) -> Worktree:
        proved = {proof.point for proof in self.proofs.worktree_proofs(worktree.id).all_rows() if proof.task_id == task.id}
        unproved = [str(point) for point in range(1, brief_point_count(task.brief) + 1) if point not in proved]
        if unproved:
            raise Refusal(f"point {', '.join(unproved)} has no proof", f"journal proof make {unproved[0]} \"<file:line, and the test that shows it>\"")
        base_commit = self.git.tip(worktree.folder, worktree.base_branch)
        conflicts = self.git.rebased_commit(worktree, f"task {task.id}: {task.title}", f"Journal: worker worker-{worktree.agent_id}")
        if conflicts:
            raise Refusal(f"your work clashes with {worktree.base_branch} in {', '.join(conflicts)}", "settle the conflict markers in those files, then hand in again")
        current = worktree.moved(WorktreeLifecycle.advance, base_commit=base_commit)
        if not self.git.changed_files(current):
            raise Refusal("your worktree has no change", "make the change, or say in a proof why none is needed and ask for release")
        if base_commit != worktree.base_commit:
            self.git.rebuild(current, self.queries.query(Environment).find(worktree.environment_id).folder)
        return self.repository.save(current, context)
