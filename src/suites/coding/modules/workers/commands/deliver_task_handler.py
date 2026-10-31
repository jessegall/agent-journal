from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from suites.coding.modules.workers.commands.deliver_task import DeliverTask
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.brief_points import brief_point_count


class DeliverTaskHandler(Handler[DeliverTask, Task]):
    """Commits a worker's proved and changed worktree and moves its task to testing."""

    command = DeliverTask

    def __init__(self, queries: Queries, worktrees: WorktreeQuery, proofs: ProofQuery, repository: Repository, git: WorktreeGit) -> None:
        self.queries, self.worktrees, self.proofs, self.repository, self.git = queries, worktrees, proofs, repository, git

    def handle(self, command: DeliverTask, context: Context) -> Task:
        worktree = self.worktrees.worker_worktree(context.actor.id)
        if worktree is None or worktree.state is not WorktreeState.CUT:
            raise Refusal("only a worker with a started task delivers", "journal worker-worktree list shows the worktrees")
        task = self.queries.query(Task).find(worktree.task_id)
        proved = {proof.point for proof in self.proofs.worktree_proofs(worktree.id).all_rows()}
        unproved = [str(point) for point in range(1, brief_point_count(task.brief) + 1) if point not in proved]
        if unproved:
            raise Refusal(f"point {', '.join(unproved)} has no proof", f"journal proof make {unproved[0]} \"<file:line, and the test that shows it>\"")
        if not self.git.commit(worktree, f"task {task.id}: {task.title}", f"Journal: worker worker-{worktree.agent_id}"):
            raise Refusal("your worktree has no change", "make the change, or say in a proof why none is needed and ask for release")
        self.repository.save(worktree.moved(WorktreeLifecycle.deliver), context)
        return self.repository.save(task.moved(TaskLifecycle.test), context)
