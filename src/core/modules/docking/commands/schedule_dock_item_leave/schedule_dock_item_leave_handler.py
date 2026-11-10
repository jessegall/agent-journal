from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.docking.commands.schedule_dock_item_leave.schedule_dock_item_leave import ScheduleDockItemLeave
from core.modules.docking.models.dock_item import DockItem
from core.modules.docking.support.pending_dock_items import PendingDockItems


class ScheduleDockItemLeaveHandler(Handler[ScheduleDockItemLeave, DockItem]):
    """Saves the time the item leaves at."""

    command = ScheduleDockItemLeave

    def __init__(self, queries: Queries, repository: Repository, pending: PendingDockItems) -> None:
        self.queries, self.repository, self.pending = queries, repository, pending

    def handle(self, command: ScheduleDockItemLeave, context: Context) -> DockItem:
        item = self.queries.query(DockItem).find(command.item_id)
        saved = self.repository.update(item, context, leaves_at=command.leaves_at)
        self.pending.remove(saved)
        return saved
