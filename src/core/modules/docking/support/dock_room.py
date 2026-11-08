from core.modules.docking.models.dock_item import DockItem
from core.modules.docking.support.chat_docked_items import ChatDockedItems
from core.modules.docking.support.dock_limits import DockLimits
from core.modules.docking.support.environment_docks import EnvironmentDocks
from core.modules.docking.support.leave_time import LeaveTime
from core.modules.docking.support.row_end import RowEnd

MOST_PLACES = 1_000_000


class DockRoom:
    """The places a dock has for more items: those below its limits, and one more for each item that may leave, which is
    one that is not kept and whose row has ended or is not still running."""

    def __init__(self, docks: EnvironmentDocks, items: ChatDockedItems, limits: DockLimits, row_end: RowEnd, leave_time: LeaveTime) -> None:
        self.docks, self.items, self.limits, self.row_end, self.leave_time = docks, items, limits, row_end, leave_time

    def leaving(self, docked: list[DockItem]) -> DockItem | None:
        return next((item for item in docked if not item.kept and self.row_end.ended(item)), None) or next((item for item in docked if not item.kept and not self.leave_time.is_running(item)), None)

    def places(self, type_name: str) -> int:
        dock = self.docks.find()
        if dock is None or self.limits.requires_user(type_name):
            return MOST_PLACES
        docked = self.items.read(dock.id)
        of_type = [item for item in docked if item.type == type_name]
        type_capacity = self.limits.type_capacity(type_name)
        room = [self.room(docked, self.limits.dock_capacity(dock.id))]
        if type_capacity is not None:
            room.append(self.room(of_type, type_capacity))
        return max(0, min(room))

    def room(self, docked: list[DockItem], capacity: int) -> int:
        return capacity - len(docked) + sum(1 for item in docked if not item.kept and (self.row_end.ended(item) or not self.leave_time.is_running(item)))
