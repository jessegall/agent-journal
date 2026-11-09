from argparse import ArgumentParser, Namespace
from pathlib import Path

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.base.user_approval_refusal import UserApprovalRefusal


class ProposePluginSubcommand(ReadSubcommand[PluginManifest]):
    """`journal plugin propose <folder> --why "<what for>"`: an agent names a plugin the person may install.
    """

    cli_name = "plugin"
    name = "propose"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("source")
        parser.add_argument("--why", dest="why", required=True)

    def read(self, arguments: Namespace, caller: Caller) -> PluginManifest:
        manifest = PluginManifest.read(Path(arguments.source))
        raise UserApprovalRefusal(f"Install {manifest.title}?\n{arguments.why}", ("plugin", "install", arguments.source, "--yes"))

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, PluginManifest):
            output.line(f"proposed {value.name}: the user installs it if they want it")
