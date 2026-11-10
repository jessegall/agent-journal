from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.docking.commands.release_dock_item.release_dock_item import ReleaseDockItem
from core.modules.docking.models.dock_item import DockItem
from core.modules.docking.support.leave_time import LeaveTime


class ReleaseDockItemHandler(Handler[ReleaseDockItem, DockItem]):
    """Marks the item not kept and gives it the time it leaves at, when its row has already ended."""

    command = ReleaseDockItem

    def __init__(self, queries: Queries, repository: Repository, leave_time: LeaveTime) -> None:
        self.queries, self.repository, self.leave_time = queries, repository, leave_time

    def handle(self, command: ReleaseDockItem, context: Context) -> DockItem:
        released = self.queries.query(DockItem).find(command.item_id).changed(kept=False)
        return self.repository.save(released.changed(leaves_at=self.leave_time.departure(released, context.timestamp)), context)
