from engine.agent.agent_checkouts import AgentCheckouts
from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.plugins.commands.queue_plugin_run.queue_plugin_run import QueuePluginRun
from core.modules.plugins.models.enums.queued_run_state import QueuedRunState
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.support.plugin_command_runner import RUN_LIMIT_SECONDS
from core.modules.plugins.models.queued_run import QueuedRun
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.plugins.support.queued_run_places import QueuedRunPlaces
from core.modules.plugins.support.queued_run_start import QueuedRunStart
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.commands.support.part_spec import PartSpec
from core.modules.processes.models.process import Process



class QueuePluginRunHandler(Handler[QueuePluginRun, QueuedRunStart]):
    """Makes the process of a plugin's queued run, under the category its kind declares, and the row that follows
    it, running at once when the queue gives it its place in the same save; a kind that coalesces gives back the run of the same line in the same folder that still waits."""

    command = QueuePluginRun

    def __init__(self, queries: Queries, repository: Repository, bus: Bus, checkouts: AgentCheckouts, folders: PluginFolders, places: QueuedRunPlaces) -> None:
        self.queries, self.repository, self.bus, self.checkouts, self.folders, self.places = queries, repository, bus, checkouts, folders, places

    def handle(self, command: QueuePluginRun, context: Context) -> QueuedRunStart:
        if self.queries.query(Plugin).filter(name=command.plugin).first() is None:
            raise Refusal(f"no plugin is named {command.plugin}", "journal plugin list names them")
        declared = PluginManifest.read(self.folders.code(command.plugin)).process_kind(command.kind)
        if declared is None:
            raise Refusal(f"plugin {command.plugin} declares no kind of run named {command.kind}", "name a kind its manifest lists under processes")
        folder = command.folder or str(self.checkouts.checkout(command.agent_id).root)
        if declared.coalesce:
            for waiting in self.queries.query(QueuedRun).filter(plugin=command.plugin, kind=command.kind, state=QueuedRunState.WAITING).all_rows():
                process = self.queries.query(Process).find(waiting.process_id)
                if process.queued_at is not None and (process.folder, process.line) == (folder, command.line):
                    return QueuedRunStart(waiting, process, True, command.is_detached)
        start = StartProcess(command.agent_id, None, command.line, folder, "", declared.category, RUN_LIMIT_SECONDS, [PartSpec(command.line, command.line.split()[0], False, declared.category)],
                             timeout_durations=command.timeout_durations, plugin=command.plugin, kind=command.kind, priority=command.priority)
        started = self.bus.dispatch(start, context)
        run = self.repository.save(QueuedRun(environment_id=started.environment_id, creator_id=context.actor.id, plugin=command.plugin, kind=command.kind,
                                             session_agent_id=command.agent_id, process_id=started.id), context)
        process = self.queries.query(Process).find(started.id)
        if process.queued_at is None:
            run = self.places.admitted(run, process, context)
        return QueuedRunStart(run, process, False, command.is_detached)
