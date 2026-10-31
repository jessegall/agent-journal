from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.docking.commands.schedule_dock_item_leave import ScheduleDockItemLeave
from core.modules.docking.models.dock_item import DockItem


class ScheduleDockItemLeaveHandler(Handler[ScheduleDockItemLeave, DockItem]):
    """Saves the time the item leaves at."""

    command = ScheduleDockItemLeave

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: ScheduleDockItemLeave, context: Context) -> DockItem:
        return self.repository.save(self.queries.query(DockItem).find(command.item_id).changed(leaves_at=command.leaves_at), context)
