from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.plugins.commands.upgrade_plugin.upgrade_plugin import UpgradePlugin
from core.modules.plugins.support.plugin_upgrade import PluginUpgrade


class UpgradePluginSubcommand(Subcommand[UpgradePlugin, PluginUpgrade]):
    """`journal plugin upgrade <name> [--yes] [--from <folder>]`: shows what changes in what the plugin runs, and
    applies it with --yes; --from takes the code once from a local folder and leaves the plugin's source as it is."""

    cli_name = "plugin"
    name = "upgrade"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("name")
        parser.add_argument("--yes", action="store_true")
        parser.add_argument("--from", dest="folder", default="")

    def command(self, arguments: Namespace, caller: Caller) -> UpgradePlugin:
        return UpgradePlugin(arguments.name, arguments.yes, arguments.folder)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, PluginUpgrade):
            head = f"{value.name} is now {value.version}; its running services start again within a minute" if value.applied else f"{value.name} {value.installed} to {value.version}: journal plugin upgrade {value.name} --yes"
            output.write("\n".join([head, *value.changes, *value.diff]), value.json())
