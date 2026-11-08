from collections.abc import Mapping

from core.base.query.queries import Queries
from core.modules.environments.models.environment import Environment
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.plugins.support.plugin_program import PluginProgram
from core.modules.plugins.support.plugin_settings import PluginSettings


class PluginAliasVariables:
    """The variables a plugin's alias gets from an agent's run, as an event's script gets them: JOURNAL_ENV,
    the name of the environment the agent runs in, and JOURNAL_SETTINGS, the file holding the plugin's
    settings for that environment, its overrides over the project's values, written before the run."""

    def __init__(self, queries: Queries, folders: PluginFolders, settings: PluginSettings, program: PluginProgram) -> None:
        self.queries, self.folders, self.settings, self.program = queries, folders, settings, program

    def variables(self, plugin_id: int, environment_id: int | None) -> Mapping[str, str]:
        plugin = self.queries.query(Plugin).find(plugin_id)
        environment = self.queries.query(Environment).find(environment_id).name if environment_id is not None else ""
        manifest = PluginManifest.read(self.folders.code(plugin.name))
        self.program.write_settings(plugin.name, self.settings.values(plugin, manifest, environment), environment)
        return {"JOURNAL_ENV": environment, "JOURNAL_SETTINGS": str(self.program.settings_path(plugin.name, environment))}
