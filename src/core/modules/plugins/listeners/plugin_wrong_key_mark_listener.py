from engine.change.logged_event import LoggedEvent
from engine.change.registry_synced import RegistrySynced
from engine.command.bus import Bus
from engine.module.module_actors import ModuleActors
from engine.query.queries import Queries
from engine.listener.event_rows import EventRows
from engine.scope.scopes import Scopes
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.environments.models.environment import Environment
from core.modules.plugins.models.enums.plugin_mark_type import PluginMarkType
from core.modules.plugins.models.enums.plugin_mark_variant import PluginMarkVariant
from core.modules.plugins.support.plugin_event_rows import PluginEventRows
from core.modules.plugins.models.enums.plugin_event_state import PluginEventState
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.plugins.support.runnable_plugins import RunnablePlugins


UNDECLARED_READS_TEXT = "Plugin {plugin} runs commands in the shells of limited agents, and those shells no longer read project folders it has not declared. If it reads one, it declares project_reads in its manifest."


class PluginWrongKeyMarkListener(MarkListener[RegistrySynced]):
    """Reports enabled plugins with unknown event keys or undeclared project reads."""

    name = "plugins.wrong-key-mark"
    module_name = "journal.core.plugins"

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries, event_rows: EventRows, runnable: RunnablePlugins, rows: PluginEventRows, folders: PluginFolders, scopes: Scopes) -> None:
        super().__init__(bus, actors, queries, event_rows)
        self.runnable, self.rows, self.folders, self.scopes = runnable, rows, folders, scopes

    def handle(self, event: RegistrySynced, logged: LoggedEvent) -> None:
        environment = self.queries.query(Environment).oldest().first()
        if environment is None:
            return
        with self.scopes.opened(None, environment.id):
            for runnable in self.runnable.running():
                self.show_wrong_keys(runnable.plugin.id, runnable.plugin.name, runnable.manifest, logged)
                if runnable.manifest.aliases and not runnable.manifest.project_reads:
                    self.show(logged, PluginMarkType.HEALTH, PluginMarkVariant.WRONG_KEY, UNDECLARED_READS_TEXT.format(plugin=runnable.plugin.name), key=f"plugin-undeclared-reads:{runnable.plugin.id}")

    def show_wrong_keys(self, plugin_id: int, plugin_name: str, manifest: PluginManifest, logged: LoggedEvent) -> None:
        for row in self.rows.rows(manifest, self.folders.code(plugin_name)):
            if row.state is not PluginEventState.WRONG_KEY:
                continue
            ending = ", so that guard no longer runs" if row.form == "guard" else ""
            self.show(logged, PluginMarkType.HEALTH, PluginMarkVariant.WRONG_KEY, f"Plugin {plugin_name} listens to {row.key}, which this journal no longer has{ending}.", key=f"plugin-wrong-key:{plugin_id}:{row.key}")
