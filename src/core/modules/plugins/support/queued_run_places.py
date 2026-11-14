from engine.command.context import Context
from engine.errors.refusal import Refusal
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.environments.models.environment import Environment
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.models.enums.queued_run_state import QueuedRunState
from core.modules.plugins.models.enums.run_scope import RunScope
from core.modules.plugins.models.queued_run import QueuedRun
from core.modules.plugins.support.machine_runs import MachineRuns
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.manifest_run_type import ManifestRunType
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.plugins.support.plugin_settings import PluginSettings
from core.modules.processes.models.process import Process


class QueuedRunPlaces:
    """A queued run the queue gave its place is running; a run of a kind counted over the machine takes its place
    there too, in the same save, counted and claimed together under the limit its setting names, so the next
    waiting run of that kind counts it. A place the machine no longer has is refused."""

    def __init__(self, repository: Repository, folders: PluginFolders, machine: MachineRuns, queries: Queries, settings: PluginSettings) -> None:
        self.repository, self.folders, self.machine, self.queries, self.settings = repository, folders, machine, queries, settings

    def admitted(self, run: QueuedRun, process: Process, context: Context) -> QueuedRun:
        manifest = PluginManifest.read(self.folders.code(process.plugin))
        declared = manifest.process_category(process.run_name)
        if declared is not None and declared.scope is RunScope.MACHINE and not self.machine.claim(process, self.limit(process, manifest, declared)):
            raise Refusal(f"the machine already runs as many {process.plugin} {process.run_name} runs as its setting allows", "the run waits for a place")
        return self.repository.update(run, context, state=QueuedRunState.RUNNING)

    def limit(self, process: Process, manifest: PluginManifest, declared: ManifestRunType) -> int | None:
        plugin = self.queries.query(Plugin).filter(name=process.plugin).first()
        environment = self.queries.query(Environment).find(process.environment_id)
        limit = self.settings.values(plugin, manifest, environment.name).get(declared.concurrent_setting)
        return limit if isinstance(limit, int) and limit > 0 else None
