import shlex
from dataclasses import replace

from core.base.actor import Actor
from core.base.caller.caller import Caller
from core.base.cli.console import Console
from core.base.cli.usage_error import UsageError
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.outside_runs import OutsideRuns
from core.base.module.module_actors import ModuleActors
from core.base.refusal import Refusal
from core.modules.plugins.commands.record_plugin_fault.record_plugin_fault import RecordPluginFault
from core.modules.plugins.support.plugin_answer import MOST_COMMAND_LINES
from core.modules.plugins.support.plugin_code_faults import PLUGIN_CODE_FAULTS
from core.modules.plugins.support.plugin_event_answer import PluginEventAnswer
from core.modules.plugins.support.plugins_module_name import MODULE_NAME


class PluginAnswerLines:
    """Runs the journal lines a listen script answers inside the change's transaction, as the plugins module and marked
    as coming from that plugin, so they run no guard or listen script. A line that fails is undone by its savepoint
    and recorded on the plugin, and the change goes on."""

    def __init__(self, console: Console, actors: ModuleActors, bus: Bus) -> None:
        self.console, self.actors, self.bus = console, actors, bus

    def carry_out(self, answered: PluginEventAnswer, key: str, context: Context) -> None:
        actor = self.actors.actor(MODULE_NAME)
        marked = replace(context, outside_runs=OutsideRuns(True, answered.plugin))
        for line in answered.answer.commands[:MOST_COMMAND_LINES]:
            self.carried_line(line, actor, answered, key, marked)

    def carried_line(self, line: str, actor: Actor, answered: PluginEventAnswer, key: str, marked: Context) -> None:
        try:
            self.console.dispatched(shlex.split(line), Caller(actor, marked.environment_id), marked)
        except (Refusal, UsageError, *PLUGIN_CODE_FAULTS) as error:
            self.bus.dispatch(RecordPluginFault(answered.plugin_id, f"it failed line {line} at {key} (listen): {error}"), replace(marked, actor=actor))
