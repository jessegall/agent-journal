from core.base.model.lifecycle import Lifecycle
from core.base.model.move import Move
from core.modules.docking.models.enums.dock_item_state import DockItemState


class DockItemLifecycle(Lifecycle):
    states = DockItemState
    initial = [DockItemState.DOCKED]
    editable = [DockItemState.DOCKED]
    deletable = [DockItemState.DOCKED, DockItemState.UNDOCKED]

    undock = Move("undock", [DockItemState.DOCKED], DockItemState.UNDOCKED)
    dock = Move("dock", [DockItemState.UNDOCKED], DockItemState.DOCKED)
