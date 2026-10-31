import json

from core.base.change.logged_event import LoggedEvent
from core.base.clock import Clock
from core.base.listener.commit_listener import CommitListener
from core.base.query.queries import Queries
from core.base.type_guards import is_mapping
from core.modules.environments.models.environment import Environment
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.models.plugin_delivery import PluginDelivery
from core.modules.plugins.support.plugin_call import PluginCall
from core.modules.plugins.support.plugin_event import PluginEvent
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.plugins.support.plugin_program import PluginProgram
from core.modules.plugins.support.plugin_queue import PluginQueue
from core.modules.plugins.support.plugin_settings import PluginSettings

DELIVERY_LIMIT_MS = 60_000


class PluginDeliveryListener(CommitListener):
    """Runs a plugin's program for an event it plugin_event without holding it, once the hook has committed, and puts
    the line it tells in its queue, which reaches the agent at its next hook."""

    name = "plugins.delivery"
    event = "plugin_delivery.create"

    def __init__(self, queries: Queries, folders: PluginFolders, program: PluginProgram, settings: PluginSettings, clock: Clock) -> None:
        self.queries, self.folders, self.program, self.settings, self.clock = queries, folders, program, settings, clock

    def handle(self, event: LoggedEvent) -> None:
        delivery = self.queries.query(PluginDelivery).find(event.row_id)
        plugin = self.queries.query(Plugin).find(delivery.plugin_id)
        if not plugin.enabled:
            return
        manifest = PluginManifest.read(self.folders.code(plugin.name))
        environment = self.queries.query(Environment).find(delivery.environment_id).name
        data: object = json.loads(delivery.data)
        plugin_event = PluginEvent(delivery.event, {str(key): value for key, value in data.items()} if is_mapping(data) else {})
        answer = self.program.run(PluginCall(manifest, plugin_event, environment, self.clock.timestamp(), self.settings.values(plugin, manifest)), DELIVERY_LIMIT_MS)
        if answer.line:
            PluginQueue(self.folders.data(plugin.name)).add(environment, answer.line, f"delivery-{delivery.id}")
