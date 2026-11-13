from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from suites.coding.modules.workers.commands.record_behind_look.record_behind_look import RecordBehindLook
from suites.coding.modules.workers.models.worktree_behind_look import WorktreeBehindLook


class RecordBehindLookHandler(Handler[RecordBehindLook, None]):
    """Keeps the time of the last look of the environment, one row each, so a restart waits for the next look."""

    command = RecordBehindLook
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: RecordBehindLook, context: Context) -> None:
        check = self.queries.query(WorktreeBehindLook).first()
        if check is None:
            self.repository.save(WorktreeBehindLook(looked_at=context.timestamp), context)
            return
        self.repository.update(check, context, looked_at=context.timestamp)
