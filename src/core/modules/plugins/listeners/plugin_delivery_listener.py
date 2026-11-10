import json
from collections.abc import Mapping
from pathlib import Path

from engine.agent.agent_checkouts import AgentCheckouts
from engine.event.logged_event import LoggedEvent
from engine.checkout.checkout import Checkout
from engine.checkout.checkout_file import CheckoutFile
from engine.time.clock import Clock
from engine.command.bus import Bus
from engine.command.script_policy import DELIVERY_LIMIT_MS, ScriptPolicy
from engine.enums.event_form import EventForm
from engine.listener.commit_listener_runner import PLUGIN_RUN_ORDER
from engine.command.command import Command
from engine.listener.commit_listener import CommitListener
from engine.module.module_actors import ModuleActors
from engine.query.queries import Queries
from engine.types.type_guards import is_mapping, is_object_mapping
from core.modules.environments.models.environment import Environment
from core.modules.plugins.commands.add_plugin_output.add_plugin_output import AddPluginOutput
from core.modules.plugins.commands.record_plugin_fault.record_plugin_fault import RecordPluginFault
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.models.plugin_delivery import PluginDelivery
from core.modules.plugins.support.plugin_event_runner import PluginEventRunner
from core.modules.plugins.support.plugin_event import PluginEvent
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_queue import PluginQueue
from core.modules.plugins.support.plugin_run import PluginRun
from core.modules.plugins.support.plugin_run_request import PluginRunRequest
from core.modules.plugins.support.plugins_module_name import MODULE_NAME
from core.modules.plugins.support.runnable_plugins import RunnablePlugins
from engine.event.created import Created

FILE_FIELD = "file"
COMMIT_SUFFIX = " (commit)"


class PluginDeliveryListener(CommitListener[Created[PluginDelivery]]):
    """Runs committed plugin deliveries; deliveries interrupted by a server stop remain pending."""

    name = "plugins.delivery"
    run_order = PLUGIN_RUN_ORDER

    def __init__(self, queries: Queries, folders: PluginFolders, runnable: RunnablePlugins, runs: PluginRun, clock: Clock, bus: Bus, actors: ModuleActors, checkouts: AgentCheckouts, runner: PluginEventRunner, policy: ScriptPolicy) -> None:
        self.queries, self.folders, self.runnable, self.runs, self.clock, self.bus, self.actors, self.checkouts, self.runner, self.policy = queries, folders, runnable, runs, clock, bus, actors, checkouts, runner, policy

    def handle(self, event: Created[PluginDelivery], logged: LoggedEvent) -> None:
        delivery = event.row
        plugin = self.queries.query(Plugin).filter(id=delivery.plugin_id).first()
        if plugin is None or not plugin.enabled:
            return
        if delivery.script and not self.runner.may_try(plugin, delivery.event, EventForm.COMMIT):
            return
        check = self.runnable.check(plugin)
        if check.runnable is None:
            self.runner.record_check(check, f"at {delivery.event}", logged.id)
            return
        environment = self.queries.query(Environment).find(delivery.environment_id).name if delivery.environment_id is not None else ""
        data: object = json.loads(delivery.data)
        event_data = {str(key): value for key, value in data.items()} if is_mapping(data) else {}
        file_checkout = self.delivery_checkout(delivery, event_data)
        file_values = event_data.get(FILE_FIELD)
        if file_checkout is not None and is_object_mapping(file_values):
            event_data[FILE_FIELD] = self.with_file_state(file_checkout, file_values)
        location = f"at {delivery.event}{COMMIT_SUFFIX if delivery.script else ''}"
        request = PluginRunRequest(check.runnable, PluginEvent(delivery.event, event_data), EventForm.COMMIT, self.policy.commit_limit_ms if delivery.script else DELIVERY_LIMIT_MS,
                                   location, environment, self.clock.timestamp(), delivery.session_agent_id, delivery.script, file_checkout)
        outcome = self.runs.run(request)
        answer = outcome.answer
        if answer is None:
            self.runs.record(request, outcome, logged.id)
            return
        if delivery.script and answer.is_refusal():
            self.record(logged, delivery, RecordPluginFault(delivery.plugin_id, f"it answered refuse at {delivery.event}{COMMIT_SUFFIX}: {answer.reason}"))
            return
        self.runs.record(request, outcome, logged.id)
        if answer.line and delivery.session_agent_id is not None:
            PluginQueue(self.folders.data(plugin.name)).add(environment, delivery.session_agent_id, answer.line, f"delivery-{delivery.id}")
        if answer.has_output():
            self.bus.run(AddPluginOutput(plugin.id, delivery.session_agent_id, answer.output, bool(delivery.script)), self.actors.actor(MODULE_NAME), cause_id=logged.id, environment_id=delivery.environment_id)

    def delivery_checkout(self, delivery: PluginDelivery, event_data: Mapping[str, object]) -> Checkout | None:
        file = event_data.get(FILE_FIELD)
        return self.checkouts.file_checkout(delivery.session_agent_id, Path(str(file["path"]))) if is_mapping(file) and delivery.session_agent_id is not None else None

    def with_file_state(self, checkout: Checkout, values: Mapping[str, object]) -> dict[str, object]:
        file = CheckoutFile.restored(values)
        return file.with_state(self.checkouts.file_state(checkout, file.relative)).values()

    def record(self, logged: LoggedEvent, delivery: PluginDelivery, command: Command[object]) -> None:
        self.bus.run(command, self.actors.actor(MODULE_NAME), cause_id=logged.id)
