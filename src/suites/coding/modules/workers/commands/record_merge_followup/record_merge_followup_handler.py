from engine.command.context import Context
from engine.command.handler import Handler
from core.base.listener.event_rows import EventRows
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from suites.coding.modules.workers.commands.record_merge_followup.record_merge_followup import RecordMergeFollowup
from suites.coding.modules.workers.models.merge_followup import PENDING_STEP, MergeFollowup
from suites.coding.modules.workers.models.worktree import Worktree


class RecordMergeFollowupHandler(Handler[RecordMergeFollowup, MergeFollowup]):
    """Saves the plan of a merge's required commands with every step pending."""

    command = RecordMergeFollowup
    disabled_scopes = [ActorScope]

    def __init__(self, rows: EventRows, repository: Repository) -> None:
        self.rows, self.repository = rows, repository

    def handle(self, command: RecordMergeFollowup, context: Context) -> MergeFollowup:
        worktree = self.rows.required(Worktree, command.worktree_id)
        return self.repository.save(MergeFollowup(worktree_id=worktree.id, worker_id=worktree.session_agent_id, creator_id=context.actor.id,
                                                  folder=command.folder, target_branch=worktree.base_branch, previous_commit=command.previous_commit,
                                                  commit_after=command.commit_after, revision=command.revision, commands=command.commands,
                                                  results=tuple(PENDING_STEP for _ in command.commands)), context)
