from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.environments.models.environment import Environment
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.commands.merge_worker.merge_worker import MergeWorker
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from suites.coding.modules.workers.support.merge_outcome import MergeOutcome
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.merge_checks import MergeChecks
from suites.coding.modules.workers.support.worker_job import MERGE_CONFLICT_SOURCE


class MergeWorkerHandler(Handler[MergeWorker, MergeOutcome]):
    """Merges a checked worktree into its base branch in the environment's folder, in the order of doc 1101
    4.5. A moved base is rebased under the worker's uncommitted changes first; only a clash that stays goes
    back to the worker."""

    command = MergeWorker

    def __init__(self, queries: Queries, worktrees: WorktreeQuery, checks: MergeChecks, repository: Repository, git: WorktreeGit) -> None:
        self.queries, self.worktrees, self.checks, self.repository, self.git = queries, worktrees, checks, repository, git

    def handle(self, command: MergeWorker, context: Context) -> MergeOutcome:
        worktree = self.worktrees.worker_worktree(command.worker_id)
        if worktree is None or worktree.state is not WorktreeState.DELIVERED:
            raise Refusal(f"worker {command.worker_id} has delivered nothing to merge", "journal worker-worktree list shows the worktrees")
        environment = self.queries.query(Environment).find(worktree.environment_id)
        self.check(worktree, environment)
        task = self.queries.query(Task).find(worktree.task_id)
        uncommitted = self.git.uncommitted_overlap(environment.folder, worktree)
        if uncommitted:
            raise Refusal(f"the checkout of environment {environment.name} has uncommitted changes to {', '.join(uncommitted)}",
                          f"worker {worktree.agent_id} changes them too: commit or stash them, then merge again")
        moved = self.git.tip(environment.folder, worktree.base_branch) != worktree.base_commit
        rebased = moved and self.git.rebase(worktree)
        conflicts = self.git.conflict_files(worktree) if rebased else ()
        if not conflicts:
            self.git.commit(worktree, f"task {task.id}: {task.title}", f"Journal: worker worker-{worktree.agent_id}")
            conflicts = self.git.sync(worktree) if moved and not rebased else ()
        if conflicts:
            return MergeOutcome(self.returned(worktree, task, conflicts, context), conflicts)
        self.git.merge(environment.folder, worktree, f"task {task.id}: {task.title}, from worker {worktree.agent_id}")
        for delivered in self.delivered_tasks(worktree, task):
            self.repository.save(delivered.close(context.timestamp, context.actor, f"merged into {worktree.base_branch}"), context)
        merged = self.repository.save(worktree.merge(context.timestamp, context.actor), context)
        self.git.remove(environment.folder, merged)
        return MergeOutcome(self.repository.save(merged.remove(context.timestamp, context.actor), context), ())

    def delivered_tasks(self, worktree: Worktree, task: Task) -> list[Task]:
        delivered = tuple(self.queries.query(Task).filter(delegated_to=worktree.agent_id, state=TaskState.TESTING).all_rows())
        return [task, *(row for row in delivered if row.id != task.id)]

    def check(self, worktree: Worktree, environment: Environment) -> None:
        self.checks.check_proofs(worktree)
        self.checks.check_base_branch(worktree)
        head = self.git.head(environment.folder)
        if head != worktree.base_branch:
            raise Refusal(f"the checkout of environment {environment.name} is on {head}, not on {worktree.base_branch}; the merge waits until it is back",
                          f"switch the checkout back to {worktree.base_branch}, then merge again")

    def returned(self, worktree: Worktree, task: Task, conflicts: tuple[str, ...], context: Context) -> Worktree:
        self.repository.save(task.moved(TaskLifecycle.retest), context)
        line = (f"{worktree.base_branch} is merged into your worktree and clashes on {', '.join(conflicts)}: settle the conflict markers in those files,"
                f" then deliver again with journal worker deliver")
        self.repository.save(AgentLine(agent_id=worktree.agent_id, creator_id=context.actor.id, text=line, source=MERGE_CONFLICT_SOURCE), context)
        return self.repository.save(worktree.moved(WorktreeLifecycle.rework), context)
