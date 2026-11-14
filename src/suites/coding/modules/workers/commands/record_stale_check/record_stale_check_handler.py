from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from suites.coding.modules.workers.commands.record_stale_check.record_stale_check import RecordStaleCheck
from suites.coding.modules.workers.models.worktree_stale_check_time import WorktreeStaleCheckTime


class RecordStaleCheckHandler(Handler[RecordStaleCheck, None]):
    """Keeps the time of the last look of the environment, one row each, so a restart waits for the next look."""

    command = RecordStaleCheck
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: RecordStaleCheck, context: Context) -> None:
        check = self.queries.query(WorktreeStaleCheckTime).first()
        if check is None:
            self.repository.save(WorktreeStaleCheckTime(checked_at=context.timestamp), context)
            return
        self.repository.update(check, context, checked_at=context.timestamp)
