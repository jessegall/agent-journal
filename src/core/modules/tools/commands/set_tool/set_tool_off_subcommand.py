from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.tools.commands.set_tool.set_tool import SetTool
from core.modules.tools.support.tool_card import ToolCard


class SetToolOffSubcommand(Subcommand[SetTool, ToolCard]):
    """`journal tool off <name>`: turns a supported tool off."""

    cli_name = "tool"
    name = "off"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("tool_name")

    def command(self, arguments: Namespace, caller: Caller) -> SetTool:
        return SetTool(arguments.tool_name, False)
