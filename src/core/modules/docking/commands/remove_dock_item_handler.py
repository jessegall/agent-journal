from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.docking.commands.remove_dock_item import RemoveDockItem
from core.modules.docking.models.dock_item import DockItem


class RemoveDockItemHandler(Handler[RemoveDockItem, DockItem]):
    """Moves the item to undocked."""

    command = RemoveDockItem

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: RemoveDockItem, context: Context) -> DockItem:
        return self.repository.save(self.queries.query(DockItem).find(command.item_id).undock(context.timestamp, context.actor), context)
