from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.tools.commands.install_tool.install_tool import InstallTool
from core.modules.tools.support.tool_card import ToolCard


class InstallToolSubcommand(Subcommand[InstallTool, ToolCard]):
    """`journal tool install <name>`: installs a supported tool."""

    cli_name = "tool"
    name = "install"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("tool_name")

    def command(self, arguments: Namespace, caller: Caller) -> InstallTool:
        return InstallTool(arguments.tool_name)
