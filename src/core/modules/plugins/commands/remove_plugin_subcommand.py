from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.plugins.commands.remove_plugin import RemovePlugin


class RemovePluginSubcommand(Subcommand[RemovePlugin, str]):
    """`journal plugin remove <name> [--purge]`."""

    cli_name = "plugin"
    name = "remove"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("plugin")
        parser.add_argument("--purge", action="store_true")

    def command(self, arguments: Namespace, caller: Caller) -> RemovePlugin:
        return RemovePlugin(arguments.plugin, arguments.purge)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, str):
            output.line(value)
