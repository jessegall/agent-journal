from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.environments.models.environment import Environment
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.commands.merge_worker import MergeWorker
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from suites.coding.modules.workers.commands.worker_merge import WorkerMerge
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.merge_checks import MergeChecks

SOURCE = "workers.merge-clash"


class MergeWorkerHandler(Handler[MergeWorker, WorkerMerge]):
    """Merges a checked worktree into its base branch in the environment's folder, in the order of doc 1101 4.5."""

    command = MergeWorker

    def __init__(self, queries: Queries, worktrees: WorktreeQuery, checks: MergeChecks, repository: Repository, git: WorktreeGit) -> None:
        self.queries, self.worktrees, self.checks, self.repository, self.git = queries, worktrees, checks, repository, git

    def handle(self, command: MergeWorker, context: Context) -> WorkerMerge:
        worktree = self.worktrees.worker_worktree(command.worker_id)
        if worktree is None or worktree.state is not WorktreeState.DELIVERED:
            raise Refusal(f"worker {command.worker_id} has delivered nothing to merge", "journal worker-worktree list shows the worktrees")
        environment = self.queries.query(Environment).find(worktree.environment_id)
        self.check(worktree, environment)
        task = self.queries.query(Task).find(worktree.task_id)
        conflicts = self.git.rebase(worktree) if self.git.tip(environment.folder, worktree.base_branch) != worktree.base_commit else ()
        if conflicts:
            return WorkerMerge(self.returned(worktree, task, conflicts, context), conflicts)
        uncommitted = self.git.uncommitted_overlap(environment.folder, worktree)
        if uncommitted:
            raise Refusal(f"the checkout of environment {environment.name} has uncommitted changes to {', '.join(uncommitted)}",
                          f"worker {worktree.agent_id} changes them too: commit or stash them, then merge again")
        self.git.merge(environment.folder, worktree, f"task {task.id}: {task.title}, from worker {worktree.agent_id}")
        self.repository.save(task.close(context.timestamp, context.actor, f"merged into {worktree.base_branch}"), context)
        merged = self.repository.save(worktree.merge(context.timestamp, context.actor), context)
        self.git.remove(environment.folder, merged)
        return WorkerMerge(self.repository.save(merged.remove(context.timestamp, context.actor), context), ())

    def check(self, worktree: Worktree, environment: Environment) -> None:
        self.checks.check_proofs(worktree)
        self.checks.check_base_branch(worktree)
        head = self.git.head(environment.folder)
        if head != worktree.base_branch:
            raise Refusal(f"the checkout of environment {environment.name} is on {head}, not on {worktree.base_branch}; the merge waits until it is back",
                          f"switch the checkout back to {worktree.base_branch}, then merge again")

    def returned(self, worktree: Worktree, task: Task, conflicts: tuple[str, ...], context: Context) -> Worktree:
        self.repository.save(task.moved(TaskLifecycle.retest), context)
        line = (f"the rebase of your work onto {worktree.base_branch} clashed on {', '.join(conflicts)}: change them so they fit {worktree.base_branch},"
                f" then deliver again with journal worker deliver")
        self.repository.save(AgentLine(agent_id=worktree.agent_id, creator_id=context.actor.id, text=line, source=SOURCE), context)
        return self.repository.save(worktree.moved(WorktreeLifecycle.rework), context)
