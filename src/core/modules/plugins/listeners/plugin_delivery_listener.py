import json
from collections.abc import Mapping
from pathlib import Path

from core.base.agent_checkouts import AgentCheckouts
from core.base.change.logged_event import LoggedEvent
from core.base.checkout import Checkout
from core.base.checkout_file import CheckoutFile
from core.base.clock import Clock
from core.base.command.bus import Bus
from core.base.command.script_policy import DELIVERY_LIMIT_MS, ScriptPolicy
from core.base.model.event_form import EventForm
from core.base.listener.commit_listener_runner import PLUGIN_RUN_ORDER
from core.base.command.command import Command
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.type_guards import is_mapping
from core.modules.environments.models.environment import Environment
from core.modules.plugins.commands.add_plugin_output.add_plugin_output import AddPluginOutput
from core.modules.plugins.commands.clear_plugin_faults.clear_plugin_faults import ClearPluginFaults
from core.modules.plugins.commands.record_plugin_fault.record_plugin_fault import RecordPluginFault
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.models.plugin_delivery import PluginDelivery
from core.modules.plugins.support.plugin_call import PluginCall
from core.modules.plugins.support.plugin_event_runner import PluginEventRunner
from core.modules.plugins.support.plugin_event import PluginEvent
from core.modules.plugins.support.plugin_fault_error import PluginFaultError
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.plugins.support.plugin_program import PluginProgram
from core.modules.plugins.support.plugin_queue import PluginQueue
from core.modules.plugins.support.plugin_settings import PluginSettings
from core.modules.plugins.support.plugins_module_name import MODULE_NAME
from core.base.change.created import Created

FILE_FIELD = "file"
COMMIT_SUFFIX = " (commit)"


class PluginDeliveryListener(CommitListener[Created[PluginDelivery]]):
    """Runs committed plugin deliveries and queues their answers."""

    name = "plugins.delivery"
    run_order = PLUGIN_RUN_ORDER

    def __init__(self, queries: Queries, folders: PluginFolders, program: PluginProgram, settings: PluginSettings, clock: Clock, bus: Bus, actors: ModuleActors, checkouts: AgentCheckouts, runner: PluginEventRunner, policy: ScriptPolicy) -> None:
        self.queries, self.folders, self.program, self.settings, self.clock, self.bus, self.actors, self.checkouts, self.runner, self.policy = queries, folders, program, settings, clock, bus, actors, checkouts, runner, policy

    def handle(self, event: Created[PluginDelivery], logged: LoggedEvent) -> None:
        delivery = event.row
        plugin = self.queries.query(Plugin).filter(id=delivery.plugin_id).first()
        if plugin is None or not plugin.enabled:
            return
        try:
            manifest = PluginManifest.read(self.folders.code(plugin.name))
        except Refusal as refusal:
            self.record(logged, delivery, RecordPluginFault(delivery.plugin_id, f"{refusal.reason} at {delivery.event}"))
            return
        if manifest.needs_newer_journal:
            return
        if delivery.script and not self.runner.may_try(plugin, delivery.event, EventForm.COMMIT):
            return
        if delivery.script and not self.runner.may_run(plugin, manifest, logged.id):
            return
        environment = self.queries.query(Environment).find(delivery.environment_id).name if delivery.environment_id is not None else ""
        data: object = json.loads(delivery.data)
        event_data = {str(key): value for key, value in data.items()} if is_mapping(data) else {}
        file_checkout = self.delivery_checkout(delivery, event_data)
        if file_checkout is not None:
            event_data[FILE_FIELD] = self.with_file_state(file_checkout, event_data[FILE_FIELD])
        call = PluginCall(manifest, PluginEvent(delivery.event, event_data), environment, self.clock.timestamp(), self.settings.values(plugin, manifest), delivery.session_agent_id, file_checkout, script=delivery.script)
        try:
            answer = self.program.run(call, self.policy.commit_limit_ms if delivery.script else DELIVERY_LIMIT_MS)
        except PluginFaultError as fault:
            self.record(logged, delivery, RecordPluginFault.from_error(delivery.plugin_id, fault, f"at {delivery.event}{COMMIT_SUFFIX if delivery.script else ''}"))
            return
        if delivery.script and answer.is_refusal():
            self.record(logged, delivery, RecordPluginFault(delivery.plugin_id, f"it answered refuse at {delivery.event}{COMMIT_SUFFIX}: {answer.reason}"))
            return
        if plugin.fault_count:
            self.record(logged, delivery, ClearPluginFaults(delivery.plugin_id))
        if answer.line and delivery.session_agent_id is not None:
            PluginQueue(self.folders.data(plugin.name)).add(environment, delivery.session_agent_id, answer.line, f"delivery-{delivery.id}")
        if answer.has_output():
            self.bus.run(AddPluginOutput(plugin.id, delivery.session_agent_id, answer.output, bool(delivery.script)), self.actors.actor(MODULE_NAME), cause_id=logged.id, environment_id=delivery.environment_id)

    def delivery_checkout(self, delivery: PluginDelivery, event_data: Mapping[str, object]) -> Checkout | None:
        file = event_data.get(FILE_FIELD)
        return self.checkouts.file_checkout(delivery.session_agent_id, Path(str(file["path"]))) if is_mapping(file) and delivery.session_agent_id is not None else None

    def with_file_state(self, checkout: Checkout, values: object) -> dict[str, object]:
        file = CheckoutFile.restored(values)
        return file.with_state(self.checkouts.file_state(checkout, file.relative)).values()

    def record(self, logged: LoggedEvent, delivery: PluginDelivery, command: Command[object]) -> None:
        self.bus.run(command, self.actors.actor(MODULE_NAME), cause_id=logged.id)
