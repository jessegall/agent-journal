from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.errors.refusal import Refusal
from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from core.modules.environments.support.environment_rows import EnvironmentRows
from suites.coding.modules.workers.commands.record_failed_update.record_failed_update import RecordFailedUpdate
from suites.coding.modules.workers.commands.update_worker.update_worker import UpdateWorker
from suites.coding.modules.workers.models.enums.update_result import UpdateResult
from suites.coding.modules.workers.models.worker_operation import WorkerOperation
from suites.coding.modules.workers.support.worktree_update import WorktreeUpdate
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.behind_check_closing import BehindCheckClosing
from suites.coding.modules.workers.support.update_outcome import UpdateOutcome
from suites.coding.modules.workers.support.worktree_git import WorktreeGit


class UpdateWorkerHandler(Handler[UpdateWorker, UpdateOutcome]):
    """Brings the worker's own worktree up to its base branch before the transaction opens, since git moves
    its files; then records the base the worktree stands on and how the update ended on the operation that ran
    it. Built web files are made again when the base moved under a clean update. A check of the worktree
    closes as brought up to date, or moves to clashing when the update left markers; an update that fails and
    changes nothing is noted on the check and told to the merger before its refusal goes on to the worker."""

    command = UpdateWorker
    disabled_scopes = [ActorScope]

    def __init__(self, worktrees: WorktreeQuery, git: WorktreeGit, environments: EnvironmentRows, repository: Repository, queries: Queries, closing: BehindCheckClosing, bus: Bus) -> None:
        self.worktrees, self.git, self.environments, self.repository, self.queries, self.closing, self.bus = worktrees, git, environments, repository, queries, closing, bus
        self.update = WorktreeUpdate("")
        self.result = UpdateResult.CURRENT

    def prepare(self, command: UpdateWorker, actor: Actor) -> None:
        worktree = self.worktrees.required_worker_worktree(actor.id)
        try:
            self.update = self.git.update(worktree)
        except Refusal as refusal:
            self.bus.run(RecordFailedUpdate(actor.id, refusal.text), actor, environment_id=worktree.environment_id)
            raise
        self.result = self.classified(self.update)
        if self.result is UpdateResult.UPDATED:
            self.git.rebuild(worktree, self.environments.find(worktree.environment_id).folder)

    @staticmethod
    def classified(update: WorktreeUpdate) -> UpdateResult:
        if not update.is_clean():
            return UpdateResult.CONFLICTS
        return UpdateResult.CURRENT if update.unchanged else UpdateResult.UPDATED

    def handle(self, command: UpdateWorker, context: Context) -> UpdateOutcome:
        worktree = self.worktrees.required_worker_worktree(context.actor.id)
        if self.update.base_commit and self.update.base_commit != worktree.base_commit:
            self.repository.save_change(worktree, worktree.updated(self.update.base_commit), context)
        if self.result is UpdateResult.CONFLICTS:
            self.closing.conflicted(worktree, context)
        else:
            self.closing.close_updated(worktree, context)
        operation = self.queries.query(WorkerOperation).filter(worker_id=context.actor.id, process_id=command.process_id).first() if command.process_id is not None else None
        if operation is not None:
            self.repository.update(operation, context, update_outcome=self.result)
        return UpdateOutcome(worktree.base_branch, self.update, self.result)
