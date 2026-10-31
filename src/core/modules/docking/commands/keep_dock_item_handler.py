from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.docking.commands.keep_dock_item import KeepDockItem
from core.modules.docking.models.dock_item import DockItem


class KeepDockItemHandler(Handler[KeepDockItem, DockItem]):
    """Marks the item kept and drops the time it would leave at."""

    command = KeepDockItem

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: KeepDockItem, context: Context) -> DockItem:
        return self.repository.save(self.queries.query(DockItem).find(command.item_id).changed(kept=True, leaves_at=None), context)
