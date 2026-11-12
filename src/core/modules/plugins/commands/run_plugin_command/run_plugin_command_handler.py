from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.plugins.commands.run_plugin_command.run_plugin_command import RunPluginCommand
from core.modules.plugins.support.plugin_command_run import PluginCommandRun
from core.modules.plugins.support.plugin_command_runner import PluginCommandRunner


class RunPluginCommandHandler(Handler[RunPluginCommand, PluginCommandRun]):
    """Holds no write lock, so a slow command makes nobody else wait."""

    command = RunPluginCommand

    def __init__(self, runner: PluginCommandRunner) -> None:
        self.runner = runner

    def handle(self, command: RunPluginCommand, context: Context) -> PluginCommandRun:
        return self.runner.run(command.agent_id, command.line, command.is_readonly, command.plugin, context, command.kind)
