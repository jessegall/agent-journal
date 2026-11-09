from core.base.actor import Actor
from core.base.command.bus import Bus
from core.modules.tasks.commands.make_task_log.make_task_log import MakeTaskLog
from suites.coding.modules.workers.support.worker_log_lines import WorkerLogLines
from suites.coding.modules.workers.support.worker_review import WorkerReview
from core.base.command.context import Context
from core.base.conflict_files import ConflictFiles
from pathlib import Path
from core.base.command.handler import Handler
from core.base.listener.event_rows import EventRows
from engine.errors.refusal import Refusal
from core.base.scope.actor_scope import ActorScope
from core.modules.environments.models.environment import Environment
from core.modules.environments.support.environment_rows import EnvironmentRows
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.commands.merge_worker.merge_worker import MergeWorker
from suites.coding.modules.workers.commands.record_worktree_merge.record_worktree_merge import RecordWorktreeMerge
from suites.coding.modules.workers.commands.record_worktree_removal.record_worktree_removal import RecordWorktreeRemoval
from suites.coding.modules.workers.commands.support.merge_followups import MergeFollowups
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from suites.coding.modules.workers.support.merge_outcome import MergeOutcome
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.merge_followup import MergeFollowup
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.merge_checks import MergeChecks
from suites.coding.modules.workers.commands.send_worker.support.worker_queued_start import WorkerQueuedStart
from suites.coding.modules.workers.commands.record_merge_request.record_merge_request import RecordMergeRequest
from suites.coding.modules.workers.commands.send_worker.send_worker import SendWorker

class MergeWorkerHandler(Handler[MergeWorker, MergeOutcome]):
    """Merges a checked worktree into its base branch in the environment's folder, in the order of doc 1101
    4.5. A moved base is rebased under the worker's uncommitted changes first; only a clash that stays goes
    back to the worker. The merge commands run before the task closes, so a failed one, such as a push, leaves
    the task open to merge again. Git runs outside any transaction, so its wait holds no write lock."""

    runs_once = True
    command = MergeWorker
    disabled_scopes = [ActorScope]

    def __init__(self, rows: EventRows, worktrees: WorktreeQuery, checks: MergeChecks, git: WorktreeGit, environments: EnvironmentRows, bus: Bus, followups: MergeFollowups, log_lines: WorkerLogLines, queued_start: WorkerQueuedStart) -> None:
        self.log_lines, self.queued_start = log_lines, queued_start
        self.rows, self.worktrees, self.checks, self.git = rows, worktrees, checks, git
        self.environments, self.bus, self.followups = environments, bus, followups

    def check_rows(self, command: MergeWorker, actor: Actor) -> None:
        worktree = self.worktrees.worker_worktree(command.worker_id)
        if worktree is None or worktree.state is not WorktreeState.DELIVERED:
            raise Refusal(f"worker {command.worker_id} has delivered nothing to merge", "journal worker-worktree list shows the worktrees")
        self.checks.check_proofs(worktree)
        self.checks.check_logs(worktree)
        self.checks.check_base_branch(worktree)
        self.checks.check_important_lines(worktree, self.log_lines.review(worktree), command.important_answer)

    def handle(self, command: MergeWorker, context: Context) -> MergeOutcome:
        worktree = self.worktrees.worker_worktree(command.worker_id)
        if worktree is None or worktree.state is not WorktreeState.DELIVERED:
            raise Refusal(f"worker {command.worker_id} has delivered nothing to merge", "journal worker-worktree list shows the worktrees")
        environment = self.environments.find(worktree.environment_id)
        self.check(worktree, environment)
        planned = self.followups.planned(worktree.id)
        if planned is not None:
            return self.finished_merge(worktree, environment, planned, command, context)
        review = self.log_lines.review(worktree)
        self.checks.check_important_lines(worktree, review, command.important_answer)
        self.keep_answer(worktree, review, command.important_answer, context)
        task = self.rows.required(Task, worktree.task_id)
        uncommitted = self.git.uncommitted_overlap(environment.folder, worktree)
        if uncommitted:
            raise Refusal(f"the checkout of environment {environment.name} has uncommitted changes to {', '.join(uncommitted)}",
                          f"worker {worktree.session_agent_id} changes them too: commit or stash them, then merge again")
        conflicts = self.git.rebased_commit(worktree, f"task {task.id}: {task.title}", f"Journal: worker worker-{worktree.session_agent_id}")
        if conflicts:
            return self.bus.run_with_context(RecordWorktreeMerge(worktree.id, conflicts), context)
        self.git.refuse_deleted_built_files(worktree, self.git.comparison(worktree))
        self.git.rebuild(worktree, environment.folder)
        commit_before_merge = self.git.tip(environment.folder, worktree.base_branch)
        refusal = self.refused_merge(worktree, environment, commit_before_merge, context)
        if refusal:
            return MergeOutcome(self.rows.required(Worktree, worktree.id), (), refusal)
        self.git.merge(environment.folder, worktree, f"task {task.id}: {task.title}, from worker {worktree.session_agent_id}")
        commit_after_merge = self.git.tip(environment.folder, worktree.base_branch)
        followup = self.followups.record_followup(worktree, environment.folder, commit_before_merge, commit_after_merge, context)
        if followup is not None:
            return self.finished_merge(worktree, environment, followup, command, context)
        merge_outcome = self.bus.run_with_context(RecordWorktreeMerge(worktree.id, (), commit_before_merge, commit_after_merge), context)
        return self.removed(environment, merge_outcome.worktree, context)

    def finished_merge(self, worktree: Worktree, environment: Environment, followup: MergeFollowup, command: MergeWorker, context: Context) -> MergeOutcome:
        self.followups.run(followup, command.reconciled, context)
        merge_outcome = self.bus.run_with_context(RecordWorktreeMerge(worktree.id, (), followup.previous_commit, followup.commit_after), context)
        return self.removed(environment, merge_outcome.worktree, context)

    def removed(self, environment: Environment, merged: Worktree, context: Context) -> MergeOutcome:
        self.git.remove(environment.folder, merged)
        removal = self.bus.run_with_context(RecordWorktreeRemoval(merged.id), context)
        self.queued_start.start(merged.session_agent_id, context)
        return MergeOutcome(removal, ())

    def refused_merge(self, worktree: Worktree, environment: Environment, target_commit: str, context: Context) -> str:
        branch_commit = self.git.tip(environment.folder, worktree.branch)
        try:
            self.bus.run_with_context(RecordMergeRequest(worktree.id, target_commit, branch_commit, worktree.folder), context)
        except Refusal as refusal:
            findings = f"{refusal.reason}: {refusal.suggestion}" if refusal.suggestion else refusal.reason
            self.bus.run_with_context(SendWorker(worktree.session_agent_id, f"Your merge into {worktree.base_branch} was refused before anything was merged:\n{findings}\nFix it in your worktree and deliver again."), context)
            return findings
        return ""

    def keep_answer(self, worktree: Worktree, review: WorkerReview, answer: str, context: Context) -> None:
        for task in review.tasks:
            lines = [(flagged_line, True) for flagged_line in review.flagged[task.id]]
            if review.important_lines(task):
                lines.append((f"main agent on the important lines: {answer}", False))
            for line, important in lines:
                self.bus.run(MakeTaskLog(task.id, line, important=important), context.actor, environment_id=worktree.environment_id)

    def check(self, worktree: Worktree, environment: Environment) -> None:
        ConflictFiles(Path(environment.folder)).check()
        self.checks.check_proofs(worktree)
        self.checks.check_logs(worktree)
        self.checks.check_base_branch(worktree)
        waiting = self.followups.blocked_followup(worktree)
        if waiting is not None and self.followups.planned(worktree.id) is None:
            raise Refusal(f"the merge of worker {waiting.worker_id} still has required commands to run in environment {environment.name}",
                          f"merge worker {waiting.worker_id} again to finish them, with --reconcile if a step ended uncertain")
        head = self.git.head(environment.folder)
        if head != worktree.base_branch:
            raise Refusal(f"the checkout of environment {environment.name} is on {head}, not on {worktree.base_branch}; the merge waits until it is back",
                          f"switch the checkout back to {worktree.base_branch}, then merge again")
