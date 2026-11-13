from engine.command.context import Context
from engine.repository.repository import Repository
from core.modules.plugins.models.enums.queued_run_state import QueuedRunState
from core.modules.plugins.models.enums.run_scope import RunScope
from core.modules.plugins.models.queued_run import QueuedRun
from core.modules.plugins.support.machine_runs import MachineRuns
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.processes.models.process import Process


class QueuedRunPlaces:
    """A queued run the queue gave its place is running; a run of a kind counted over the machine takes its place
    there too, in the same save, so the next waiting run of that kind counts it."""

    def __init__(self, repository: Repository, folders: PluginFolders, machine: MachineRuns) -> None:
        self.repository, self.folders, self.machine = repository, folders, machine

    def admitted(self, run: QueuedRun, process: Process, context: Context) -> QueuedRun:
        declared = PluginManifest.read(self.folders.code(process.plugin)).process_category(process.kind)
        if declared is not None and declared.scope is RunScope.MACHINE:
            self.machine.claim(process)
        return self.repository.update(run, context, state=QueuedRunState.RUNNING)
