from dataclasses import replace

from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.errors.refusal import Refusal
from core.modules.plugins.commands.run_plugin_command.run_plugin_command import RunPluginCommand
from core.modules.plugins.support.plugin_answer import PluginAnswer


class PluginQueuedJudge:
    """Turns a plugin's queue answer into the answer of the run it asked for. The run is queued under
    the kind its manifest declares, exactly as journal plugin run --kind queues it, and no hook time
    limit applies to it. A run that exits with 0 lets the step go on; any other exit refuses it,
    with what the run printed as the reason."""

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def settled(self, answer: PluginAnswer, plugin: str, agent_id: int | None, environment_id: int | None) -> PluginAnswer:
        if not answer.is_queue() or answer.run is None:
            return answer
        if agent_id is None:
            return self.refused(answer, f"plugin {plugin} queued a judge run, which runs in the checkout of an agent, and nothing here was done by an agent")
        try:
            run = self.bus.run(RunPluginCommand(agent_id, answer.run.line(), False, plugin, answer.run.kind), Actor.core(), environment_id=environment_id)
        except Refusal as refusal:
            return self.refused(answer, str(refusal))
        if run.exit_code == 0:
            return replace(answer, answer="allow", run=None)
        return self.refused(answer, run.output.strip() or f"the judge run {run.process_id} ended with exit code {run.exit_code}")

    @staticmethod
    def refused(answer: PluginAnswer, reason: str) -> PluginAnswer:
        return replace(answer, answer="refuse", reason=reason, run=None)
