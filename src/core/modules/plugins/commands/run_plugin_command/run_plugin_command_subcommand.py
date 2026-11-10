import argparse
import shlex
from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.cli.usage_error import UsageError
from engine.errors.refusal import Refusal
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.plugins.commands.run_plugin_command.run_plugin_command import RunPluginCommand
from core.modules.plugins.support.plugin_call_access import PluginCallAccess
from core.modules.plugins.support.plugin_command_run import PluginCommandRun

LINE_SEPARATOR = "--"


class RunPluginCommandSubcommand(Subcommand[RunPluginCommand, PluginCommandRun]):
    """Runs a command in an agent's checkout and returns its output and exit code."""

    cli_name = "plugin"
    name = "run"
    outward = True

    def __init__(self, access: PluginCallAccess) -> None:
        self.access = access

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--agent", type=int)
        parser.add_argument("--read-only", action="store_true")
        parser.add_argument("line", nargs=argparse.REMAINDER)

    def command(self, arguments: Namespace, caller: Caller) -> RunPluginCommand:
        if self.access.is_limited(caller):
            raise Refusal("an agent may not use journal plugin run", "run the command in your own shell")
        command_args = arguments.line[1:] if arguments.line[:1] == [LINE_SEPARATOR] else arguments.line
        if not command_args:
            raise UsageError("name the command to run after --")
        return RunPluginCommand(self.access.agent_id(arguments.agent, caller), shlex.join(command_args), arguments.read_only, caller.plugin_script)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, PluginCommandRun):
            output.write(f"{value.output}output {value.process_id}, exit code {value.exit_code}", output.values(value))
