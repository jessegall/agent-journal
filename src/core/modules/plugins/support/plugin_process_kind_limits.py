from engine.query.queries import Queries
from core.modules.environments.models.environment import Environment
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.plugins.support.plugin_settings import PluginSettings
from core.modules.processes.models.process import Process
from core.modules.processes.support.process_kind_limits import ProcessKindLimits


class PluginProcessKindLimits(ProcessKindLimits):
    """The limit of a plugin's kind of run: the value of the plugin setting its manifest names for that kind."""

    def __init__(self, queries: Queries, folders: PluginFolders, settings: PluginSettings) -> None:
        self.queries, self.folders, self.settings = queries, folders, settings

    def limit(self, process: Process) -> int | None:
        if not process.plugin or not process.kind:
            return None
        plugin = self.queries.query(Plugin).filter(name=process.plugin).first()
        if plugin is None:
            return None
        manifest = PluginManifest.read(self.folders.code(plugin.name))
        declared = manifest.process_kind(process.kind)
        if declared is None or not declared.at_once_setting:
            return None
        environment = self.queries.query(Environment).find(process.environment_id).name
        value = self.settings.values(plugin, manifest, environment).get(declared.at_once_setting)
        return value if isinstance(value, int) and value > 0 else None
