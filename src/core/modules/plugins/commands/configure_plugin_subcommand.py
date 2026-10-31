from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.plugins.commands.configure_plugin import ConfigurePlugin
from core.modules.plugins.models.plugin_setting import PluginSetting


class ConfigurePluginSubcommand(Subcommand[ConfigurePlugin, PluginSetting]):
    """`journal plugin configure <name> <key> <value>`."""

    cli_name = "plugin"
    name = "configure"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("plugin")
        parser.add_argument("key")
        parser.add_argument("value")

    def command(self, arguments: Namespace, caller: Caller) -> ConfigurePlugin:
        self.plugin_name = arguments.plugin
        return ConfigurePlugin(arguments.plugin, arguments.key, arguments.value)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, PluginSetting):
            output.line(f"{self.plugin_name} {value.key} = {value.value}")
