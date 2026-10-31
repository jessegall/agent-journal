from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.docking.commands.make_dock import MakeDock
from core.modules.docking.models.dock import Dock


class MakeDockHandler(Handler[MakeDock, Dock]):
    """Saves the environment's dock when it has none."""

    command = MakeDock

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: MakeDock, context: Context) -> Dock:
        existing = next(self.queries.query(Dock).filter(environment_id=command.environment_id).all_rows(), None)
        return existing or self.repository.save(Dock(environment_id=command.environment_id, creator_id=context.actor.id), context)
