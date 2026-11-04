from collections.abc import Mapping

from core.base.timestamp import Timestamp
from core.modules.plugins.queries.plugin_query import PluginQuery
from core.modules.plugins.support.plugin_call import PluginCall
from core.modules.plugins.support.plugin_event import PluginEvent
from core.modules.plugins.support.plugin_fault_error import PluginFaultError
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.plugins.support.plugin_program import PluginProgram
from core.modules.plugins.support.plugin_settings import PluginSettings

STEP_CEILING_MS = 180_000


class PluginStepCheck:
    """Asks enabled plugins to accept an operation, with a time limit for each reply."""

    def __init__(self, plugins: PluginQuery, folders: PluginFolders, program: PluginProgram, settings: PluginSettings) -> None:
        self.plugins, self.folders, self.program, self.settings = plugins, folders, program, settings

    def refusal(self, event: str, data: Mapping[str, object], environment: str, timestamp: Timestamp, agent_id: int | None = None) -> str:
        for plugin in self.plugins.enabled_ones():
            manifest = PluginManifest.read(self.folders.code(plugin.name))
            if event not in manifest.window_names():
                continue
            call = PluginCall(manifest, PluginEvent(event, data), environment, timestamp, self.settings.values(plugin, manifest), agent_id)
            try:
                answer = self.program.run(call, manifest.window_ms(event, STEP_CEILING_MS))
            except PluginFaultError:
                continue
            if answer.is_refusal():
                return f"[plugin {plugin.name}] {answer.reason}"
        return ""
