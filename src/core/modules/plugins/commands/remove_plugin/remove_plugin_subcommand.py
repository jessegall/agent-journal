from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.plugins.commands.remove_plugin.remove_plugin import RemovePlugin


class RemovePluginSubcommand(Subcommand[RemovePlugin, str]):
    """`journal plugin remove <name> [--purge]`."""

    cli_name = "plugin"
    name = "remove"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("plugin")
        parser.add_argument("--purge", action="store_true")

    def command(self, arguments: Namespace, caller: Caller) -> RemovePlugin:
        return RemovePlugin(arguments.plugin, arguments.purge)

