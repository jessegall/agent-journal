from collections.abc import Sequence
from typing import cast

from engine.enums.actor_type import ActorType
from engine.change.change import Change
from engine.change.changed import Changed
from engine.change.event_log import EventLog
from engine.cli.caller_stream import CallerStream
from engine.command.bus import Bus
from engine.command.context import Context
from engine.enums.log_level import LogLevel
from engine.log.system_log_writer import SystemLogWriter
from engine.model.event_form import EventForm
from engine.model.model import Model
from engine.registry.registry import Registry
from engine.process.plugin_script_processes import PluginScriptProcesses
from core.modules.plugins.commands.add_plugin_output.add_plugin_output import AddPluginOutput
from core.modules.plugins.commands.clear_plugin_faults.clear_plugin_faults import ClearPluginFaults
from core.modules.plugins.commands.record_plugin_fault.record_plugin_fault import RecordPluginFault
from core.modules.plugins.commands.send_plugin_step_line.send_plugin_step_line import SendPluginStepLine
from core.modules.plugins.support.plugin_event_answer import PluginEventAnswer
from core.modules.plugins.support.plugin_event_runner import PluginEventRunner
from core.modules.plugins.support.plugin_event_work import PluginEventWork
from core.modules.plugins.support.plugin_payload import PluginPayload
from core.modules.plugins.support.plugin_subscriptions import PluginSubscriptions

FAULT_WRITES = (RecordPluginFault, ClearPluginFaults)
GUARD_NAME = "plugins.event-guard"


class PluginEventScripts:
    """Gets guard and listen script answers for a change outside the transaction lock."""

    def __init__(self, subscriptions: PluginSubscriptions, log: EventLog, system_log: SystemLogWriter, registry: Registry, runner: PluginEventRunner, bus: Bus, running: PluginScriptProcesses, caller: CallerStream) -> None:
        self.subscriptions, self.log, self.system_log, self.registry, self.runner, self.bus, self.running, self.caller = subscriptions, log, system_log, registry, runner, bus, running, caller

    def answers(self, form: EventForm, event: Changed[Model], context: Context) -> Sequence[PluginEventAnswer]:
        if isinstance(context.command, FAULT_WRITES):
            return ()
        runs, change = context.external_runs, Change.event_change(event, context)
        subscriptions = self.subscriptions.scripts(change.event, form)
        if form is EventForm.GUARD:
            subscriptions = tuple(subscription for subscription in subscriptions if not (subscription.allows_skip and f"{GUARD_NAME}:{subscription.plugin}" in context.skipped_guards))
        if not subscriptions:
            return ()
        if context.explanation is not None:
            return ()
        if runs.is_plugin_script:
            return ()
        turn = runs.turn(form.value, change.event)
        if turn.answers is not None:
            return cast(Sequence[PluginEventAnswer], turn.answers)
        if runs.closed:
            self.system_log.write(LogLevel.WARNING, f"{form.value} scripts of {change.event} were skipped: {runs.closed_reason}")
            key = self.registry.event_key(change.event)
            for subscription in subscriptions:
                self.running.skipped(subscription.plugin, key, form, runs.closed_reason, context.timestamp)
            return ()
        raise runs.rollback(PluginEventWork(self.runner, self.system_log, self.caller, form, self.registry.event_key(change.event), subscriptions, PluginPayload.change_payload(change, form, self.log, None),
                                            PluginPayload.environment_id(change), self.agent_id(context), turn))

    def apply(self, answered: PluginEventAnswer, context: Context) -> None:
        agent_id = self.agent_id(context)
        answer = answered.answer
        if answer.line and agent_id is not None:
            self.bus.dispatch(SendPluginStepLine(agent_id, f"[plugin {answered.plugin}] {answer.line}"), context)
        if answer.has_output():
            self.bus.dispatch(AddPluginOutput(answered.plugin_id, agent_id, answer.output, True), context)

    @staticmethod
    def agent_id(context: Context) -> int | None:
        return context.actor.id if context.actor.type is ActorType.AGENT else None
