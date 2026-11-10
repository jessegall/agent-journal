import shlex
from dataclasses import replace

from engine.actor.actor import Actor
from core.base.caller.caller import Caller
from core.base.cli.console import Console
from core.base.cli.usage_error import UsageError
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.outside_runs import OutsideRuns
from core.base.module.module_actors import ModuleActors
from engine.errors.refusal import Refusal
from core.modules.plugins.commands.record_plugin_fault.record_plugin_fault import RecordPluginFault
from core.modules.plugins.support.plugin_answer import MOST_COMMAND_LINES
from core.modules.plugins.support.plugin_code_faults import PLUGIN_CODE_FAULTS
from core.modules.plugins.support.plugin_event_answer import PluginEventAnswer
from core.modules.plugins.support.plugins_module_name import MODULE_NAME


class PluginAnswerLines:
    """Runs journal commands from a plugin's listen answer inside the change transaction."""

    def __init__(self, console: Console, actors: ModuleActors, bus: Bus) -> None:
        self.console, self.actors, self.bus = console, actors, bus

    def run(self, answer: PluginEventAnswer, key: str, context: Context) -> None:
        actor = self.actors.actor(MODULE_NAME)
        plugin_context = replace(context, external_runs=OutsideRuns(True, answer.plugin))
        for line in answer.answer.commands[:MOST_COMMAND_LINES]:
            self.run_line(line, actor, answer, key, plugin_context)

    def run_line(self, line: str, actor: Actor, answer: PluginEventAnswer, key: str, context: Context) -> None:
        try:
            self.console.dispatched(shlex.split(line), Caller(actor, context.environment_id), context)
        except (Refusal, UsageError, *PLUGIN_CODE_FAULTS) as error:
            self.bus.dispatch(RecordPluginFault(answer.plugin_id, f"it failed line {line} at {key} (listen): {error}"), replace(context, actor=actor))
