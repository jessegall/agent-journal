from core.base.listener.commit_listener import CommitListener
from core.modules.docking.models.dock import Dock
from core.modules.docking.models.dock_item import DockItem


class SampleDockWriter(CommitListener):
    name = "samples.dock-writer"
    event = "plan.start"

    def __init__(self, repository) -> None:
        self.repository = repository

    def handle(self, event):
        # @sin architecture_docking_DockOnlyByCommandDetector
        self.repository.save(DockItem(dock_id=1, creator_id=1, type=event.event, target_model="plan", target_id=1), event)
        # @sin architecture_docking_DockOnlyByCommandDetector
        self.repository.save(Dock(environment_id=1, creator_id=1), event)
