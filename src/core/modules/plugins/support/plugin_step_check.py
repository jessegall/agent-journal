import json
from collections.abc import Mapping

from core.base.actor import Actor
from core.base.command.bus import Bus
from core.base.model.event_form import EventForm
from core.base.timestamp import Timestamp
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.plugins.commands.deliver_plugin_event.deliver_plugin_event import DeliverPluginEvent
from core.modules.plugins.commands.record_plugin_fault.record_plugin_fault import RecordPluginFault
from core.modules.plugins.commands.send_plugin_step_line.send_plugin_step_line import SendPluginStepLine
from core.modules.plugins.support.plugin_call import PluginCall
from core.modules.plugins.support.plugin_event import PluginEvent
from core.modules.plugins.support.plugin_fault_error import PluginFaultError
from core.modules.plugins.support.plugin_program import PluginProgram
from core.modules.plugins.support.plugin_settings import PluginSettings
from core.modules.plugins.support.runnable_plugins import RunnablePlugins

STEP_CEILING_MS = 180_000


class PluginStepCheck:
    """Asks enabled plugins to accept an operation, with a time limit for each reply. A plugin that faults or
    runs late lets the step through with a fault on record, and what could not be judged or what a plugin
    tells reaches the agent and its parent, so a step nobody judged never reads as clean."""

    def __init__(self, runnable: RunnablePlugins, program: PluginProgram, settings: PluginSettings, bus: Bus, agents: AgentRows) -> None:
        self.runnable, self.program, self.settings = runnable, program, settings
        self.bus, self.agents = bus, agents

    def refusal(self, event: str, data: Mapping[str, object], environment: str, timestamp: Timestamp, agent_id: int | None = None) -> str:
        for runnable in self.runnable.running():
            plugin, manifest = runnable.plugin, runnable.manifest
            commit, guard = manifest.named_event(event, EventForm.COMMIT), manifest.named_event(event, EventForm.GUARD)
            if commit is not None:
                self.bus.run(DeliverPluginEvent(plugin.id, agent_id, commit.key, json.dumps(dict(data)), commit.script), Actor.core(), environment_id=self.agents.find(agent_id).environment_id if agent_id is not None else None)
            if event not in manifest.window_names():
                continue
            call = PluginCall(manifest, PluginEvent(guard.key if guard else event, data), environment, timestamp, self.settings.values(plugin, manifest), agent_id, form=EventForm.GUARD, script=guard.script if guard else "")
            try:
                answer = self.program.run(call, None if guard else manifest.window_ms(event, STEP_CEILING_MS))
            except PluginFaultError as fault:
                self.bus.run(RecordPluginFault.from_error(plugin.id, fault, f"at {event}"), Actor.core())
                self.send_line(agent_id, f"[plugin {plugin.name}] could not judge this step: {fault}")
                continue
            if answer.is_refusal():
                return f"[plugin {plugin.name}] {answer.reason}"
            if answer.line:
                self.send_line(agent_id, f"[plugin {plugin.name}] {answer.line}")
        return ""

    def send_line(self, agent_id: int | None, text: str) -> None:
        if agent_id is not None:
            self.bus.run(SendPluginStepLine(agent_id, text), Actor.core(), environment_id=self.agents.find(agent_id).environment_id)
