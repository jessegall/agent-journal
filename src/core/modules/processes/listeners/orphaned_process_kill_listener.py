from core.modules.processes.models.lifecycles.process_lifecycle import ProcessLifecycle
from core.base.change.moved import Moved
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.modules.processes.models.process import Process
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.process_group import ProcessGroup
from core.base.command.context import Context



class OrphanedProcessKillListener(SaveListener[Moved[Process]]):
    """Kills the process group of a run that was marked orphaned, so nothing keeps running unread."""

    name = "processes.orphaned-process-kill"
    moves = tuple([ProcessLifecycle.orphan])

    def __init__(self, group: ProcessGroup, folder: OutputFolder) -> None:
        self.group, self.folder = group, folder

    def handle(self, event: Moved[Process], context: Context) -> None:
        process = event.row
        self.group.stop(process.pid or self.folder.pid(process.id), process.id)
