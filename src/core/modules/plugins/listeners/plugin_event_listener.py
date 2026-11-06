import json

from core.base.actor_type import ActorType
from core.base.change.change import Change
from core.base.change.changed import Changed
from core.base.change.event_log import EventLog
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.error_log import ErrorLog
from core.base.listener.save_listener import SaveListener
from core.base.model.event_form import EventForm
from core.base.model.model import Model
from core.base.model.tables import Tables
from core.base.registry.registry import Registry
from core.modules.plugins.commands.deliver_plugin_event.deliver_plugin_event import DeliverPluginEvent
from core.modules.plugins.support.plugin_code_faults import PLUGIN_CODE_FAULTS
from core.modules.plugins.support.plugin_event_scripts import FAULT_WRITES
from core.modules.plugins.support.plugin_payload import PluginPayload
from core.modules.plugins.support.plugin_subscriptions import PluginSubscriptions


class PluginEventListener(SaveListener[Changed[Model]]):
    """Saves a delivery for each commit script of this change, in its transaction, so a delivery exists exactly when
    the change does. A change with no script is one lookup and writes nothing. Saving a fault delivers nothing, or a
    script on the plugin row that fails would record faults without end. A failure of this code goes to the error
    log and the change goes on."""

    name = "plugins.event-listener"

    def __init__(self, subscriptions: PluginSubscriptions, bus: Bus, log: EventLog, tables: Tables, errors: ErrorLog, registry: Registry) -> None:
        self.subscriptions, self.bus, self.log, self.tables, self.errors, self.registry = subscriptions, bus, log, tables, errors, registry

    def handle(self, event: Changed[Model], context: Context) -> None:
        if isinstance(context.command, FAULT_WRITES):
            return
        change = Change.of(event, context)
        try:
            self.save_deliveries(change, context)
        except PLUGIN_CODE_FAULTS as error:
            self.errors.noted(f"plugin deliveries of {change.event} were not saved: {type(error).__name__}: {error}")

    def save_deliveries(self, change: Change[Model], context: Context) -> None:
        log_name = change.event
        subscriptions = self.subscriptions.scripts(log_name, EventForm.COMMIT)
        if not subscriptions:
            return
        row = change.row
        event_id = max(logged.id for logged in self.log.row_events(self.tables.table(type(row)).name, row.id) if logged.event == log_name)
        data = json.dumps(PluginPayload.of(change, EventForm.COMMIT, self.log, event_id))
        environment_id = PluginPayload.environment_id(change)
        agent_id = context.actor.id if context.actor.type is ActorType.AGENT else None
        key = self.registry.event_key(log_name)
        for subscription in subscriptions:
            self.bus.dispatch(DeliverPluginEvent(subscription.plugin_id, agent_id, key, data, subscription.script, event_id, environment_id), context)
