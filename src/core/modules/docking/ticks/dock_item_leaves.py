from engine.time.clock import Clock
from engine.command.bus import Bus
from engine.container.container import Container
from engine.module.module_actors import ModuleActors
from engine.query.queries import Queries
from core.modules.docking.commands.remove_dock_item.remove_dock_item import RemoveDockItem
from core.modules.docking.listeners.environment_dock_listener import MODULE_NAME
from core.modules.docking.models.dock import Dock
from core.modules.docking.queries.dock_item_query import DockItemQuery


class DockItemLeaves:
    """Removes docked items whose scheduled departure has arrived."""

    def __call__(self, container: Container) -> bool:
        items = container.get(DockItemQuery).leaving(container.get(Clock).timestamp())
        if not items:
            return False
        actor = container.get(ModuleActors).actor(MODULE_NAME)
        bus, queries = container.get(Bus), container.get(Queries)
        docks = {dock.id: dock for dock in queries.query(Dock).find_many(list({item.dock_id for item in items}))}
        for item in items:
            bus.run(RemoveDockItem(item.id), actor, environment_id=docks[item.dock_id].environment_id)
        return True
