from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.refusal import Refusal
from core.base.registry.registry import Registry
from core.modules.docking.guards.support.docking_arrival import DockingArrival


class DockTypeGuard(Guard):
    """An item is of a type an installed module declares, about a row of a model that type reads."""

    name = "docking.declared-type"
    event = "dock_item.*"

    def __init__(self, registry: Registry) -> None:
        self.registry = registry

    def check(self, change: Change[Model]) -> None:
        item = DockingArrival.item(change)
        if item is None:
            return
        declared = next((entry for entry in self.registry.docks if entry.type == item.type), None)
        if declared is None:
            raise Refusal(f"no installed module declares the dock type {item.type}", "a module declares its dock types in its docks list")
        if item.target_model not in {line.split(" ", 1)[0] for line in declared.reads}:
            raise Refusal(f"the dock type {item.type} reads no {item.target_model}", f"it reads {', '.join(declared.reads) or 'nothing'}")
