from dataclasses import replace

from engine.actor.actor import Actor
from engine.command.errors.server_stopping_error import ServerStoppingError
from engine.process.plugin_script_processes import PluginScriptProcesses
from engine.errors.refusal import Refusal
from core.modules.plugins.support.plugin_command_runner import PluginCommandRunner
from engine.time.clock import Clock
from core.modules.plugins.support.plugin_answer import PluginAnswer


class PluginQueuedJudge:
    """Turns a plugin's queue answer into the answer of the run it asked for. The run is queued under
    the kind its manifest declares, exactly as journal plugin run --kind queues it, and no hook time
    limit applies to it. A run that exits with 0 lets the step go on; any other exit refuses it,
    with what the run printed as the reason. A run the journal's restart cut off refuses nothing: the command
    ends with the restart, to be run again."""

    def __init__(self, runner: PluginCommandRunner, clock: Clock, scripts: PluginScriptProcesses) -> None:
        self.runner, self.clock, self.scripts = runner, clock, scripts

    def resolved(self, answer: PluginAnswer, plugin: str, agent_id: int | None) -> PluginAnswer:
        if not answer.is_queue() or answer.run is None:
            return answer
        if agent_id is None:
            return self.refused(answer, f"plugin {plugin} queued a judge run, which runs in the checkout of an agent, and nothing here was done by an agent")
        try:
            run = self.runner.run(agent_id, answer.run.line(), False, plugin, Actor.core(), self.clock.timestamp(), answer.run.category)
        except Refusal as refusal:
            return self.refused(answer, str(refusal))
        if run.exit_code != 0 and self.scripts.server_stopped:
            raise ServerStoppingError.judge_run(plugin, run.process_id)
        if run.exit_code == 0:
            return replace(answer, answer="allow", run=None)
        return self.refused(answer, run.output.strip() or f"the judge run {run.process_id} ended with exit code {run.exit_code}")

    @staticmethod
    def refused(answer: PluginAnswer, reason: str) -> PluginAnswer:
        return replace(answer, answer="refuse", reason=reason, run=None)
