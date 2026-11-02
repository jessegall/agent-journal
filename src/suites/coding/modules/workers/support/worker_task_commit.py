from core.base.refusal import Refusal
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.support.brief_points import brief_point_count
from suites.coding.modules.workers.support.worktree_git import WorktreeGit


class WorkerTaskCommit:
    """Commits a worker's worktree for its current task, once each point of the task's brief has a proof."""

    def __init__(self, proofs: ProofQuery, git: WorktreeGit) -> None:
        self.proofs, self.git = proofs, git

    def commit(self, worktree: Worktree, task: Task) -> None:
        proved = {proof.point for proof in self.proofs.worktree_proofs(worktree.id).all_rows() if proof.task_id == task.id}
        unproved = [str(point) for point in range(1, brief_point_count(task.brief) + 1) if point not in proved]
        if unproved:
            raise Refusal(f"point {', '.join(unproved)} has no proof", f"journal proof make {unproved[0]} \"<file:line, and the test that shows it>\"")
        committed = self.git.commit(worktree, f"task {task.id}: {task.title}", f"Journal: worker worker-{worktree.agent_id}")
        if not committed and not self.git.changed_files(worktree):
            raise Refusal("your worktree has no change", "make the change, or say in a proof why none is needed and ask for release")
