from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.docking.commands.add_dock_item import AddDockItem
from core.modules.docking.models.dock import Dock
from core.modules.docking.models.dock_item import DockItem


class AddDockItemHandler(Handler[AddDockItem, DockItem]):
    """Saves the item in the environment's dock, making the dock first when the environment has none."""

    command = AddDockItem

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: AddDockItem, context: Context) -> DockItem:
        dock = next(self.queries.query(Dock).filter(environment_id=command.environment_id).all_rows(), None)
        dock = dock or self.repository.save(Dock(environment_id=command.environment_id, creator_id=context.actor.id), context)
        return self.repository.save(DockItem(dock_id=dock.id, creator_id=context.actor.id, type=command.type, target_model=command.row_model, target_id=command.row_id), context)
