from core.base.refusal import Refusal
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.queries.plugin_query import PluginQuery
from core.modules.plugins.support.plugin_digest import PluginDigest
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.plugins.support.plugin_declared_events import PluginDeclaredEvents
from core.modules.plugins.support.runnable_plugin import RunnablePlugin


class RunnablePlugins:
    """Selects enabled plugins and reads their manifests and file changes. A plugin stays switched on while it is
    upgraded or its files changed, though it does not run then."""

    def __init__(self, plugins: PluginQuery, folders: PluginFolders, declared_events: PluginDeclaredEvents) -> None:
        self.plugins, self.folders, self.declared_events = plugins, folders, declared_events

    def switched_on(self) -> tuple[Plugin, ...]:
        return tuple(self.plugins.enabled_plugins())

    def enabled(self) -> list[RunnablePlugin]:
        return [self.runnable(plugin) for plugin in self.plugins.enabled_plugins() if not self.folders.is_upgrading(plugin.name) and self.readable_manifest(plugin) is not None]

    def running(self) -> list[RunnablePlugin]:
        return [runnable for runnable in self.enabled() if not runnable.is_changed and not runnable.manifest.needs_newer_journal]

    def unreadable(self) -> list[Plugin]:
        return [plugin for plugin in self.plugins.enabled_plugins() if not self.folders.is_upgrading(plugin.name) and self.readable_manifest(plugin) is None]

    def readable_manifest(self, plugin: Plugin) -> PluginManifest | None:
        try:
            return PluginManifest.read(self.folders.code(plugin.name))
        except Refusal:
            return None

    def runnable(self, plugin: Plugin) -> RunnablePlugin:
        code = self.folders.code(plugin.name)
        manifest = self.declared_events.apply(PluginManifest.read(code))
        return RunnablePlugin(plugin, manifest, PluginDigest.digest(code, manifest) != plugin.files_digest)
