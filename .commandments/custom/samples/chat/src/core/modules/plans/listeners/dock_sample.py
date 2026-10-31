from core.base.command.bus import Bus
from core.modules.docking.commands.add_dock_item import AddDockItem
from core.modules.docking.models.dock_item import DockItem


class SampleListener:
    def __init__(self, bus: Bus, repository) -> None:
        self.bus, self.repository = bus, repository

    def handle(self, event):
        # @sin architecture_docking_DockOnlyByCommandDetector
        self.repository.save(DockItem(dock_id=1, creator_id=1, type="plans.started", target_model="plan", target_id=1), event)
        # @righteous architecture_docking_DockOnlyByCommandDetector
        self.bus.run(AddDockItem(1, "plans.started", "plan", 1), event.actor)
