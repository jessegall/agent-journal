from core.base.guard.guard import Guard
from engine.errors.refusal import Refusal
from core.base.registry.registry import Registry
from core.modules.docking.guards.support.docking_arrival import DockingArrival
from core.base.change.changed import Changed
from core.base.command.context import Context
from core.modules.docking.models.dock_item import DockItem


class DockTypeGuard(Guard[Changed[DockItem]]):
    """An item is of a type an installed module declares, about a row of a model that type reads."""

    name = "docking.declared-type"

    def __init__(self, registry: Registry) -> None:
        self.registry = registry

    def check(self, event: Changed[DockItem], context: Context) -> None:
        item = DockingArrival.item(event)
        if item is None:
            return
        declared = next((entry for entry in self.registry.docks if entry.type == item.type), None)
        if declared is None:
            raise Refusal(f"no installed module declares the dock type {item.type}", "a module declares its dock types in its docks list")
        if item.target_model not in {line.split(" ", 1)[0] for line in declared.reads}:
            raise Refusal(f"the dock type {item.type} reads no {item.target_model}", f"it reads {', '.join(declared.reads) or 'nothing'}")
