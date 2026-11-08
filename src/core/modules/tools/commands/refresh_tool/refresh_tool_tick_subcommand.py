from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.tools.commands.refresh_tool.refresh_tool import RefreshTool
from core.modules.tools.support.graph_status import GraphStatus


class RefreshToolTickSubcommand(Subcommand[RefreshTool, GraphStatus]):
    """`journal tool tick <name> --folder <folder>`: what a turned-on tool's managed hook runs on each prompt; it
    returns at once, starts a refresh in the background only when a commit has landed since the last one, and
    prints where the graph stands for the agent."""

    cli_name = "tool"
    name = "tick"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("tool_name")
        parser.add_argument("--folder", default="")

    def command(self, arguments: Namespace, caller: Caller) -> RefreshTool:
        return RefreshTool(arguments.tool_name, arguments.folder, True)
