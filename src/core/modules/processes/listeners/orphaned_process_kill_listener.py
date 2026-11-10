from core.modules.processes.models.lifecycles.process_lifecycle import ProcessLifecycle
from engine.change.moved import Moved
from engine.change.logged_event import LoggedEvent
from engine.listener.commit_listener import CommitListener
from core.modules.processes.models.process import Process
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.process_group import ProcessGroup



class OrphanedProcessKillListener(CommitListener[Moved[Process]]):
    """Stops the process group of an orphaned run."""

    name = "processes.orphaned-process-kill"
    moves = tuple([ProcessLifecycle.orphan])

    def __init__(self, group: ProcessGroup, folder: OutputFolder) -> None:
        self.group, self.folder = group, folder

    def handle(self, event: Moved[Process], logged: LoggedEvent) -> None:
        process = event.row
        self.group.stop(process.pid or self.folder.pid(process.id), process.id)
