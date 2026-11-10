from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.drivers.commands.use_refusal_skip.use_refusal_skip import UseRefusalSkip
from core.modules.drivers.models.refusal_skip import RefusalSkip


class UseRefusalSkipHandler(Handler[UseRefusalSkip, RefusalSkip]):
    """Spends a skip, so it passes one refusal only."""

    command = UseRefusalSkip

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: UseRefusalSkip, context: Context) -> RefusalSkip:
        return self.repository.update(self.queries.query(RefusalSkip).find(command.skip_id), context, used_at=context.timestamp)
