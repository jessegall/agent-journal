import json
from dataclasses import replace

from engine.enums.actor_type import ActorType
from core.base.change.change import Change
from core.base.change.changed import Changed
from core.base.change.event_log import EventLog
from engine.command.bus import Bus
from engine.command.context import Context
from engine.enums.log_level import LogLevel
from engine.log.system_log_writer import SystemLogWriter
from core.base.listener.save_listener import SaveListener
from core.base.model.event_form import EventForm
from core.base.model.model import Model
from core.base.model.tables import Tables
from core.base.registry.registry import Registry
from core.modules.plugins.commands.deliver_plugin_event.deliver_plugin_event import DeliverPluginEvent
from core.modules.plugins.support.plugin_code_faults import PLUGIN_CODE_FAULTS
from core.modules.plugins.commands.record_plugin_fault.record_plugin_fault import RecordPluginFault
from core.modules.plugins.support.plugin_answer_lines import PluginAnswerLines
from core.modules.plugins.support.plugin_event_answer import PluginEventAnswer
from core.modules.plugins.support.plugin_event_scripts import FAULT_WRITES, PluginEventScripts
from core.modules.plugins.support.plugin_payload import PluginPayload
from core.modules.plugins.support.plugin_subscriptions import PluginSubscriptions


class PluginEventListener(SaveListener[Changed[Model]]):
    """Runs listen scripts and saves commit deliveries with the change."""

    name = "plugins.event-listener"

    def __init__(self, subscriptions: PluginSubscriptions, bus: Bus, log: EventLog, tables: Tables, system_log: SystemLogWriter, registry: Registry, scripts: PluginEventScripts, lines: PluginAnswerLines) -> None:
        self.subscriptions, self.bus, self.log, self.tables, self.system_log, self.registry, self.scripts, self.lines = subscriptions, bus, log, tables, system_log, registry, scripts, lines

    def handle(self, event: Changed[Model], context: Context) -> None:
        if isinstance(context.command, FAULT_WRITES):
            return
        change = Change.event_change(event, context)
        try:
            for answered in self.scripts.answers(EventForm.LISTEN, event, context):
                self.apply_listen_answer(answered, change, context)
            self.save_deliveries(change, context)
        except PLUGIN_CODE_FAULTS as error:
            self.system_log.write(LogLevel.ERROR, f"plugin scripts of {change.event} were not handled: {type(error).__name__}: {error}")

    def apply_listen_answer(self, answered: PluginEventAnswer, change: Change[Model], context: Context) -> None:
        key = self.registry.event_key(change.event)
        if answered.answer.is_refusal():
            self.bus.dispatch(RecordPluginFault(answered.plugin_id, f"it answered refuse at {key} (listen): {answered.answer.reason}"), context)
            return
        self.lines.run(answered, key, context)
        self.scripts.apply(replace(answered, answer=answered.answer.without_commands()), context)

    def save_deliveries(self, change: Change[Model], context: Context) -> None:
        log_name = change.event
        subscriptions = [subscription for subscription in self.subscriptions.scripts(log_name, EventForm.COMMIT) if subscription.plugin != context.external_runs.plugin_script]
        if not subscriptions:
            return
        row = change.row
        logged = self.log.latest_row(self.tables.table(type(row)).name, row.id, [log_name])
        if logged is None:
            raise ValueError(f"no {log_name} event was written for row {row.id}")
        event_id = logged.id
        data = json.dumps(PluginPayload.change_payload(change, EventForm.COMMIT, self.log, event_id))
        environment_id = PluginPayload.environment_id(change)
        agent_id = context.actor.id if context.actor.type is ActorType.AGENT else None
        key = self.registry.event_key(log_name)
        for subscription in subscriptions:
            self.bus.dispatch(DeliverPluginEvent(subscription.plugin_id, agent_id, key, data, subscription.script, event_id, environment_id), context)
