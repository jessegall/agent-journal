from core.modules.plans.models.enums.plan_dock_type import PlanDockType
from engine.command.bus import Bus
from engine.listener.commit.commit_listener import CommitListener
from core.modules.docking.commands.add_dock_item.add_dock_item import AddDockItem
from core.modules.docking.models.dock_item import DockItem


class SampleListener(CommitListener):
    name = "samples.dock"
    # @sin architecture_listeners_listener_event_named_by_a_string
    event = "plan.start"

    def __init__(self, bus: Bus, repository) -> None:
        self.bus, self.repository = bus, repository

    def handle(self, event):
        # @sin architecture_docking_dock_written_outside_docking
        self.repository.save(DockItem(dock_id=1, creator_id=1, type="plans.started", target_model="plan", target_id=1), event)
        # @righteous architecture_docking_dock_written_outside_docking
        self.bus.run(AddDockItem(PlanDockType.STARTED, "plan", 1), event.actor)
