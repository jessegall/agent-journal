from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.event_rows import EventRows
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from suites.coding.modules.workers.commands.record_merge_request.record_merge_request import RecordMergeRequest
from suites.coding.modules.workers.models.merge_request import MergeRequest
from suites.coding.modules.workers.models.worktree import Worktree


class RecordMergeRequestHandler(Handler[RecordMergeRequest, MergeRequest]):
    """Saves the merge about to happen with both ends of its range, the target branch's tip and the worker's tip."""

    command = RecordMergeRequest
    disabled_scopes = [ActorScope]

    def __init__(self, rows: EventRows, repository: Repository) -> None:
        self.rows, self.repository = rows, repository

    def handle(self, command: RecordMergeRequest, context: Context) -> MergeRequest:
        worktree = self.rows.required(Worktree, command.worktree_id)
        return self.repository.save(MergeRequest(worktree_id=worktree.id, worker_id=worktree.session_agent_id,
                                                 creator_id=context.actor.id, target_branch=worktree.base_branch, target_commit=command.target_commit,
                                                 branch=worktree.branch, branch_commit=command.branch_commit, folder=command.folder), context)
