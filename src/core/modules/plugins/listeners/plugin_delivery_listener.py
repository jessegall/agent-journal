import json

from core.base.change.logged_event import LoggedEvent
from core.base.clock import Clock
from core.base.command.bus import Bus
from core.base.command.command import Command
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.base.type_guards import is_mapping
from core.modules.environments.models.environment import Environment
from core.modules.plugins.commands.add_plugin_output import AddPluginOutput
from core.modules.plugins.commands.clear_plugin_faults import ClearPluginFaults
from core.modules.plugins.commands.record_plugin_fault import RecordPluginFault
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.models.plugin_delivery import PluginDelivery
from core.modules.plugins.support.plugin_call import PluginCall
from core.modules.plugins.support.plugin_event import PluginEvent
from core.modules.plugins.support.plugin_fault_error import PluginFaultError
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.plugins.support.plugin_program import PluginProgram
from core.modules.plugins.support.plugin_queue import PluginQueue
from core.modules.plugins.support.plugin_settings import PluginSettings

DELIVERY_LIMIT_MS = 60_000
MODULE_NAME = "journal.core.plugins"


class PluginDeliveryListener(CommitListener):
    """Runs a plugin's program for an event it plugin_event without holding it, once the hook has committed, and puts
    the line it tells in its queue, which reaches the agent at its next hook."""

    name = "plugins.delivery"
    event = "plugin_delivery.create"

    def __init__(self, queries: Queries, folders: PluginFolders, program: PluginProgram, settings: PluginSettings, clock: Clock, bus: Bus, actors: ModuleActors) -> None:
        self.queries, self.folders, self.program, self.settings, self.clock, self.bus, self.actors = queries, folders, program, settings, clock, bus, actors

    def handle(self, event: LoggedEvent) -> None:
        delivery = self.queries.query(PluginDelivery).find(event.row_id)
        plugin = self.queries.query(Plugin).find(delivery.plugin_id)
        if not plugin.enabled:
            return
        manifest = PluginManifest.read(self.folders.code(plugin.name))
        environment = self.queries.query(Environment).find(delivery.environment_id).name
        data: object = json.loads(delivery.data)
        plugin_event = PluginEvent(delivery.event, {str(key): value for key, value in data.items()} if is_mapping(data) else {})
        call = PluginCall(manifest, plugin_event, environment, self.clock.timestamp(), self.settings.values(plugin, manifest))
        try:
            answer = self.program.run(call, DELIVERY_LIMIT_MS)
        except PluginFaultError as fault:
            self.record(event, delivery, RecordPluginFault(delivery.plugin_id, f"{fault} at {delivery.event}"))
            return
        if plugin.fault_count:
            self.record(event, delivery, ClearPluginFaults(delivery.plugin_id))
        if answer.line:
            PluginQueue(self.folders.data(plugin.name)).add(environment, answer.line, f"delivery-{delivery.id}")
        if answer.has_output():
            self.record(event, delivery, AddPluginOutput(plugin.id, delivery.environment_id, delivery.agent_id, answer.output))

    def record(self, event: LoggedEvent, delivery: PluginDelivery, command: Command[object]) -> None:
        self.bus.run(command, self.actors.actor(MODULE_NAME), cause_id=event.id, environment_id=delivery.environment_id)
