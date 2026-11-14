from engine.container.container import Container
from engine.driver.layer import Layer
from engine.driver.overlay import Overlay
from engine.registry.overlay_entry import OverlayEntry
from engine.registry.registry import Registry


class Layers:
    """The overlays active for an agent on one hook, newest first, worked out from rows each time."""

    def __init__(self, registry: Registry, container: Container) -> None:
        self.registry, self.container = registry, container

    def active(self, agent_id: int, driver: str) -> list[Layer]:
        layers = [Layer(entry, row) for entry in self.registry.driver_overlays(driver) for row in self.overlay(entry).open_agent_rows(agent_id)]
        return sorted(layers, key=lambda layer: (layer.row.opened_at, layer.overlay.position, layer.row.row_id), reverse=True)

    def overlay(self, entry: OverlayEntry) -> Overlay:
        return self.container.get(entry.path.checked_class(Overlay))
