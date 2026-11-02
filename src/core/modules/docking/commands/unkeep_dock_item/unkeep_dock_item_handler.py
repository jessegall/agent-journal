from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.docking.commands.unkeep_dock_item.unkeep_dock_item import UnkeepDockItem
from core.modules.docking.models.dock_item import DockItem
from core.modules.docking.support.leave_time import LeaveTime


class UnkeepDockItemHandler(Handler[UnkeepDockItem, DockItem]):
    """Marks the item not kept and gives it the time it leaves at, when its row has already ended."""

    command = UnkeepDockItem

    def __init__(self, queries: Queries, repository: Repository, leave_time: LeaveTime) -> None:
        self.queries, self.repository, self.leave_time = queries, repository, leave_time

    def handle(self, command: UnkeepDockItem, context: Context) -> DockItem:
        released = self.queries.query(DockItem).find(command.item_id).changed(kept=False)
        return self.repository.save(released.changed(leaves_at=self.leave_time.departure(released, context.timestamp)), context)
