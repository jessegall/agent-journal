from engine.change.created import Created
from engine.change.updated import Updated
from engine.command.bus import Bus
from engine.command.context import Context
from core.base.listener.save_listener import SaveListener
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.settings.commands.remove_managed_hooks.remove_managed_hooks import RemoveManagedHooks


class StaleManagedHooksListener(SaveListener[Created[Plugin] | Updated[Plugin]]):
    """A plugin that is installed, switched on or upgraded runs its own project hooks from now on, so the managed
    hooks carrying the stamp its manifest declares are stale: they were moved into the managed file before the
    plugin ran, and they go."""

    name = "plugins.stale-managed-hooks"

    def __init__(self, bus: Bus, folders: PluginFolders) -> None:
        self.bus, self.folders = bus, folders

    def handle(self, event: Created[Plugin] | Updated[Plugin], context: Context) -> None:
        plugin, old = event.row, event.old_row
        if not plugin.enabled or (old is not None and old.enabled and old.files_digest == plugin.files_digest):
            return
        stamp = PluginManifest.read(self.folders.code(plugin.name)).hook_stamp
        if stamp:
            self.bus.dispatch(RemoveManagedHooks(stamp), context)
