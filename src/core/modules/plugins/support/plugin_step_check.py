import json
from collections.abc import Mapping

from engine.actor.actor import Actor
from core.base.command.bus import Bus
from core.base.model.event_form import EventForm
from engine.time.timestamp import Timestamp
from core.modules.environments.models.environment import Environment
from core.modules.plugins.commands.deliver_plugin_event.deliver_plugin_event import DeliverPluginEvent
from core.modules.plugins.commands.send_plugin_step_line.send_plugin_step_line import SendPluginStepLine
from core.modules.plugins.support.plugin_event import PluginEvent
from core.modules.plugins.support.plugin_run import PluginRun
from core.modules.plugins.support.plugin_run_request import PluginRunRequest
from core.modules.plugins.support.runnable_plugins import RunnablePlugins

STEP_CEILING_MS = 180_000


class PluginStepCheck:
    """Asks enabled plugins to accept an operation, with a time limit for each reply. A plugin that faults or
    runs late lets the step through with a fault on record, and what could not be judged or what a plugin
    tells reaches the agent and its parent, so a step nobody judged never reads as clean."""

    def __init__(self, runnable: RunnablePlugins, runs: PluginRun, bus: Bus) -> None:
        self.runnable, self.runs, self.bus = runnable, runs, bus

    def refusal(self, event: str, data: Mapping[str, object], environment: Environment, timestamp: Timestamp, agent_id: int) -> str:
        for runnable in self.runnable.running():
            plugin, manifest = runnable.plugin, runnable.manifest
            commit, guard = manifest.declared_event(event, EventForm.COMMIT), manifest.declared_event(event, EventForm.GUARD)
            if commit is not None:
                self.bus.run(DeliverPluginEvent(plugin.id, agent_id, commit.key, json.dumps(dict(data)), commit.script), Actor.core(), environment_id=environment.id)
            if event not in manifest.window_names():
                continue
            request = PluginRunRequest(runnable, PluginEvent(guard.key if guard else event, data), EventForm.GUARD, None if guard else manifest.window_ms(event, STEP_CEILING_MS),
                                       f"at {event}", environment.name, timestamp, agent_id, guard.script if guard else "")
            outcome = self.runs.recorded_run(request)
            answer = outcome.answer
            if answer is None:
                self.line_sender(agent_id, environment, f"[plugin {plugin.name}] could not judge this step: {outcome.fault_text}")
                continue
            if answer.is_refusal():
                return f"[plugin {plugin.name}] {answer.reason}"
            if answer.line:
                self.line_sender(agent_id, environment, f"[plugin {plugin.name}] {answer.line}")
        return ""

    def line_sender(self, agent_id: int, environment: Environment, text: str) -> None:
        self.bus.run(SendPluginStepLine(agent_id, text), Actor.core(), environment_id=environment.id)
