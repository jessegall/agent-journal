from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.tools.commands.refresh_tool.refresh_tool import RefreshTool
from core.modules.tools.support.graph.graph_status import GraphStatus


class RefreshToolSubcommand(Subcommand[RefreshTool, GraphStatus]):
    """`journal tool refresh <name>`: starts a refresh of the tool's graph now, unless one runs."""

    cli_name = "tool"
    name = "refresh"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("tool_name")
        parser.add_argument("--folder", default="")

    def command(self, arguments: Namespace, caller: Caller) -> RefreshTool:
        return RefreshTool(arguments.tool_name, arguments.folder, False)
