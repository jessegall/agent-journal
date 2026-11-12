from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from core.modules.environments.support.environment_rows import EnvironmentRows
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.commands.merge_finished_tasks.merge_finished_tasks import MergeFinishedTasks
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.checkpoint_wait_text import CheckpointWaitText
from suites.coding.modules.workers.support.merge_checks import MergeChecks
from suites.coding.modules.workers.support.merge_outcome import MergeOutcome
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from core.modules.agents.support.agent_label import AgentLabel
from engine.cli.row_numbers import RowNumbers
from suites.coding.modules.workers.support.worker_merge_range import WorkerMergeRange

MERGED_PROOFS_REASON = "a merge checks every proof of the tasks it takes in"

# A task whose work is committed and not merged is in testing, or completed by its checked proofs.
COMMITTED_TASK_STATES = (TaskState.TESTING, TaskState.COMPLETED)


class MergeFinishedTasksHandler(Handler[MergeFinishedTasks, MergeOutcome]):
    """Merges a worker's finished tasks up to one task or commit into the environment's branch and closes them,
    while the worker goes on in its worktree. Its next rebase drops the commits the branch now holds."""

    command = MergeFinishedTasks
    runs_once = True
    disabled_scopes = [ActorScope]

    def __init__(self, worktrees: WorktreeQuery, git: WorktreeGit, checks: MergeChecks, environments: EnvironmentRows, queries: Queries, proofs: ProofQuery, repository: Repository, numbers: RowNumbers, wait_text: CheckpointWaitText,
                 merge_range: WorkerMergeRange) -> None:
        self.numbers, self.wait_text, self.range = numbers, wait_text, merge_range
        self.worktrees, self.git, self.checks, self.environments = worktrees, git, checks, environments
        self.queries, self.proofs, self.repository = queries, proofs, repository

    def handle(self, command: MergeFinishedTasks, context: Context) -> MergeOutcome:
        worktree = self.worktrees.worker_worktree(command.worker_id)
        if worktree is None:
            raise Refusal(f"{AgentLabel.from_row_id(command.worker_id, self.numbers, "worker").text} has no worktree to merge from", "journal worker-worktree list shows the worktrees")
        self.checks.check_base_branch(worktree)
        environment = self.environments.find(worktree.environment_id)
        commit = self.target_commit(worktree, command.target)
        tasks = self.finished_tasks(worktree, commit)
        self.check_proofs(worktree, tasks)
        uncommitted = self.git.uncommitted_overlap(environment.folder, worktree)
        if uncommitted:
            raise Refusal(f"the checkout of environment {environment.name} has uncommitted changes to {', '.join(uncommitted)}",
                          f"{AgentLabel.from_row_id(worktree.session_agent_id, self.numbers, "worker").text} changes them too: commit or stash them, then merge again")
        numbers = ", ".join(str(task.id) for task in tasks)
        self.git.merge_revision(environment.folder, commit, f"tasks {numbers}, from {AgentLabel.from_row_id(worktree.session_agent_id, self.numbers, "worker").text}")
        reasons = self.wait_text.merged_reasons(worktree, [task.id for task in tasks])
        for task in tasks:
            if task.state is TaskState.TESTING:
                self.repository.save_change(task, task.close(context.timestamp, context.actor, reasons[task.id]), context)
        return MergeOutcome(self.repository.save_change(worktree, worktree.part_merged([task.id for task in tasks]), context), ())

    def target_commit(self, worktree: Worktree, target: str) -> str:
        if self.range.is_task_number(target):
            commit = self.range.task_commit(worktree, int(target))
            if commit is None:
                raise Refusal(f"task {target} has no commit on the branch of {AgentLabel.from_row_id(worktree.session_agent_id, self.numbers, "worker").text}", "name a task the worker has handed in")
            return commit
        if not self.range.is_on_branch(worktree, target):
            raise Refusal(f"commit {target} is not on the branch of {AgentLabel.from_row_id(worktree.session_agent_id, self.numbers, "worker").text}", "journal worker logs lists its tasks: give one of them or one of its commits")
        return target

    def finished_tasks(self, worktree: Worktree, commit: str) -> list[Task]:
        tasks = self.range.tasks_up_to(worktree, commit)
        unfinished = [str(task.id) for task in tasks if task.state not in COMMITTED_TASK_STATES]
        if unfinished or not tasks:
            raise Refusal(f"task {', '.join(unfinished) or commit} is not committed", "take in only work the worker has committed")
        return tasks

    def check_proofs(self, worktree: Worktree, tasks: list[Task]) -> None:
        numbers = {task.id for task in tasks}
        self.checks.check_states(worktree, [proof for proof in self.proofs.worktree_proofs(worktree.id).every_row(MERGED_PROOFS_REASON) if proof.task_id in numbers])
