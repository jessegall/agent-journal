from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.plugins.commands.switch_plugin.switch_plugin import SwitchPlugin
from core.modules.plugins.models.plugin import Plugin


class EnablePluginSubcommand(Subcommand[SwitchPlugin, Plugin]):
    """`journal plugin enable <name>`: switches the plugin on."""

    cli_name = "plugin"
    name = "enable"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("plugin")

    def command(self, arguments: Namespace, caller: Caller) -> SwitchPlugin:
        return SwitchPlugin(arguments.plugin, True)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Plugin):
            output.line(f"{value.name} on")
