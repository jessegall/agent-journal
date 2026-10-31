from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.plugins.commands.install_plugin import InstallPlugin
from core.modules.plugins.commands.support.plugin_install import PluginInstall


class InstallPluginSubcommand(Subcommand[InstallPlugin, PluginInstall]):
    """`journal plugin install <folder> [--yes]`: shows what it would install, and installs it with --yes."""

    cli_name = "plugin"
    name = "install"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("source")
        parser.add_argument("--yes", action="store_true")

    def command(self, arguments: Namespace, caller: Caller) -> InstallPlugin:
        return InstallPlugin(arguments.source, arguments.yes)

    def write_output(self, value: object, output: Output) -> None:
        if not isinstance(value, PluginInstall):
            return
        manifest = value.manifest
        output.line(f"{manifest.name} {manifest.version}: {manifest.title}")
        output.line(f"installed {manifest.name}, on" if value.installed else f"nothing installed yet: journal plugin install {value.source} --yes")
