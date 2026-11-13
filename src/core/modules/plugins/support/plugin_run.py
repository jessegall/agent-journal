from dataclasses import replace

from engine.command.bus import Bus
from engine.enums.event_form import EventForm
from engine.command.errors.server_stopping_error import ServerStoppingError
from engine.module.module_actors import ModuleActors
from core.modules.plugins.commands.clear_plugin_faults.clear_plugin_faults import ClearPluginFaults
from core.modules.plugins.support.hook_facts import HookFacts
from core.modules.plugins.support.plugin_call import PluginCall
from core.modules.plugins.errors.plugin_fault_error import PluginFaultError
from core.modules.plugins.support.plugin_program import PluginProgram
from core.modules.plugins.support.plugin_queued_judge import PluginQueuedJudge
from core.modules.plugins.support.plugin_run_outcome import PluginRunOutcome
from core.modules.plugins.support.plugin_run_request import PluginRunRequest
from core.modules.plugins.errors.plugin_service_closed_error import PluginServiceClosedError
from core.modules.plugins.support.plugin_settings import PluginSettings
from core.modules.plugins.support.plugins_module_name import MODULE_NAME


class PluginRun:
    """The one way to run a plugin's program for an event: it runs it, and says or records its fault or its clean
    run. A recorded guard run whose plugin queued a judge run answers with that judge run's answer, so every
    guard outside a hook settles a queue answer in this one place. A driver rule only answers, so it takes the
    records from the outcome of a plain run instead and runs no judge."""

    def __init__(self, program: PluginProgram, settings: PluginSettings, bus: Bus, actors: ModuleActors, judge: PluginQueuedJudge) -> None:
        self.program, self.settings, self.bus, self.actors, self.judge = program, settings, bus, actors, judge

    def run(self, request: PluginRunRequest) -> PluginRunOutcome:
        plugin = request.runnable.plugin
        try:
            answer = self.program.run(self.call(request), request.limit_ms, request.wait_callback)
        except PluginServiceClosedError as closed:
            record = closed.fault_record(plugin.id, request.location)
            return PluginRunOutcome(None, str(closed), records=() if plugin.last_fault == record.fault else tuple([record]))
        except PluginFaultError as fault:
            return PluginRunOutcome(None, str(fault), fault.is_late, fault.is_server_stop, tuple([fault.fault_record(plugin.id, request.location)]))
        return PluginRunOutcome(answer, records=tuple([ClearPluginFaults(plugin.id)]) if plugin.last_fault else ())

    def recorded_run(self, request: PluginRunRequest) -> PluginRunOutcome:
        outcome = self.run(request)
        self.record(request, outcome)
        if request.form is not EventForm.GUARD or outcome.answer is None:
            return outcome
        return replace(outcome, answer=self.judge.settled(outcome.answer, request.runnable.plugin.name, request.agent_id))

    def record(self, request: PluginRunRequest, outcome: PluginRunOutcome, cause_id: int | None = None) -> None:
        if outcome.is_server_stop:
            raise ServerStoppingError.plugin_wait(request.runnable.plugin.name, request.event.name)
        for command in outcome.records:
            self.bus.run(command, self.actors.actor(MODULE_NAME), cause_id=cause_id)

    def hook_facts(self, agent_id: int | None) -> HookFacts:
        return HookFacts(self.program, agent_id)

    def line(self, request: PluginRunRequest) -> str:
        return self.program.line(self.call(request), request.limit_ms)

    def call(self, request: PluginRunRequest) -> PluginCall:
        plugin, manifest = request.runnable.plugin, request.runnable.manifest
        return PluginCall(manifest, request.event, request.environment, request.timestamp, self.settings.values(plugin, manifest, request.environment), request.agent_id,
                          request.file_checkout, request.form, request.script, hook_waits=request.hook_waits, facts=request.facts, events=request.events)
