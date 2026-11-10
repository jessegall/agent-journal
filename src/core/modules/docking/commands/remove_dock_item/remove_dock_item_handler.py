from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.docking.commands.remove_dock_item.remove_dock_item import RemoveDockItem
from core.modules.docking.models.dock_item import DockItem


class RemoveDockItemHandler(Handler[RemoveDockItem, DockItem]):
    """Moves the item to undocked."""

    command = RemoveDockItem

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: RemoveDockItem, context: Context) -> DockItem:
        item = self.queries.query(DockItem).find(command.item_id)
        return self.repository.save_change(item, item.undock(context.timestamp, context.actor), context)
