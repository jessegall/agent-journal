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
    """Asks the plugins switched on that answer one of a worker's steps, its delivery or its merge, before
    the step's command is sent, in the order they were installed, each within its window and at most three
    minutes; the first refusal is the answer, and a fault or a late answer lets the step through, as in
    version 4."""

    def __init__(self, plugins: PluginQuery, folders: PluginFolders, program: PluginProgram, settings: PluginSettings) -> None:
        self.plugins, self.folders, self.program, self.settings = plugins, folders, program, settings

    def refusal(self, event: str, data: Mapping[str, object], environment: str, timestamp: Timestamp) -> str:
        for plugin in self.plugins.enabled_ones():
            manifest = PluginManifest.read(self.folders.code(plugin.name))
            if event not in manifest.window_names():
                continue
            call = PluginCall(manifest, PluginEvent(event, data), environment, timestamp, self.settings.values(plugin, manifest))
            try:
                answer = self.program.run(call, manifest.window_ms(event, STEP_CEILING_MS))
            except PluginFaultError:
                continue
            if answer.is_refusal():
                return f"[plugin {plugin.name}] {answer.reason}"
        return ""
