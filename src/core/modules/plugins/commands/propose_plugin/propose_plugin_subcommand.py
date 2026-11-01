from argparse import ArgumentParser, Namespace
from pathlib import Path

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.plugins.support.plugin_manifest import PluginManifest


class ProposePluginSubcommand(ReadSubcommand[PluginManifest]):
    """`journal plugin propose <folder> --why "<what for>"`: an agent names a plugin the person may install."""

    cli_name = "plugin"
    name = "propose"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("source")
        parser.add_argument("--why", required=True)

    def read(self, arguments: Namespace, caller: Caller) -> PluginManifest:
        return PluginManifest.read(Path(arguments.source))

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, PluginManifest):
            output.line(f"proposed {value.name}: the user installs it if they want it")
