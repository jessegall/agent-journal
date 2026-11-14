from core.modules.plugins.support.kept_plugin_checks import KeptPluginChecks
from engine.errors.refusal import Refusal
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.queries.plugin_query import PluginQuery
from core.modules.plugins.support.plugin_digest import PluginDigest
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.plugins.support.plugin_event_entries import PluginEventEntries
from core.modules.plugins.support.plugin_run_check import PluginRunCheck
from core.modules.plugins.support.runnable_plugin import RunnablePlugin


class RunnablePlugins:
    """Answers whether a plugin may run and gives its manifest. A plugin stays switched on while it is upgraded,
    needs a newer journal or its files changed, though it does not run then."""

    def __init__(self, plugins: PluginQuery, folders: PluginFolders, declared_events: PluginEventEntries) -> None:
        self.plugins, self.folders, self.declared_events = plugins, folders, declared_events

    def check(self, plugin: Plugin) -> PluginRunCheck:
        if self.folders.is_upgrading(plugin.name):
            return PluginRunCheck(plugin, reason="its upgrade is under way")
        try:
            runnable = self.runnable(plugin)
        except Refusal as refusal:
            return PluginRunCheck(plugin, reason=refusal.reason, is_unreadable=True)
        if runnable.manifest.needs_newer_journal:
            return PluginRunCheck(plugin, reason="it needs a newer journal")
        if runnable.is_changed:
            return PluginRunCheck(plugin, reason="its files changed since it was installed", is_changed=True)
        return PluginRunCheck(plugin, runnable)

    # kept across hooks while a plugin's row, upgrade and code files stay as they were
    def checks(self) -> list[PluginRunCheck]:
        kept = KeptPluginChecks.shared(self.folders.home)
        return [kept.check(plugin, self.folders.code(plugin.name), self.folders.is_upgrading(plugin.name), lambda plugin=plugin: self.check(plugin))
                for plugin in self.plugins.enabled_plugins()]

    def enabled_rows(self) -> tuple[Plugin, ...]:
        return tuple(self.plugins.enabled_plugins())

    def running(self) -> list[RunnablePlugin]:
        return [check.runnable for check in self.checks() if check.runnable is not None]

    def readable_manifest(self, plugin: Plugin) -> PluginManifest | None:
        try:
            return PluginManifest.read(self.folders.code(plugin.name))
        except Refusal:
            return None

    def runnable(self, plugin: Plugin) -> RunnablePlugin:
        code = self.folders.code(plugin.name)
        manifest = self.declared_events.apply(PluginManifest.read(code))
        return RunnablePlugin(plugin, manifest, PluginDigest.digest(code, manifest) != plugin.files_digest)
