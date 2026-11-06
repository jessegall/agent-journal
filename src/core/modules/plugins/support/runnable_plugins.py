from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.queries.plugin_query import PluginQuery
from core.modules.plugins.support.plugin_digest import PluginDigest
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.plugins.support.runnable_plugin import RunnablePlugin


class RunnablePlugins:
    """The one place that decides which plugins may run now: the enabled ones, leaving out a plugin whose upgrade is
    under way, so its manifest is never read while the upgrade replaces its folder. Each comes with its manifest and
    whether its files changed; only the plugins whose files are as installed run."""

    def __init__(self, plugins: PluginQuery, folders: PluginFolders) -> None:
        self.plugins, self.folders = plugins, folders

    def enabled(self) -> list[RunnablePlugin]:
        return [self.runnable(plugin) for plugin in self.plugins.enabled_plugins() if not self.folders.is_upgrading(plugin.name)]

    def running(self) -> list[RunnablePlugin]:
        return [runnable for runnable in self.enabled() if not runnable.is_changed]

    def runnable(self, plugin: Plugin) -> RunnablePlugin:
        code = self.folders.code(plugin.name)
        manifest = PluginManifest.read(code)
        return RunnablePlugin(plugin, manifest, PluginDigest.digest(code, manifest) != plugin.files_digest)
