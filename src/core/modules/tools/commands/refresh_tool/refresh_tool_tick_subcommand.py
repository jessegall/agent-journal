from argparse import Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from core.modules.tools.commands.refresh_tool.refresh_tool import RefreshTool
from core.modules.tools.commands.refresh_tool.refresh_tool_subcommand import RefreshToolSubcommand


class RefreshToolTickSubcommand(RefreshToolSubcommand):
    """`journal tool tick <name> --folder <folder>`: what a turned-on tool's managed hook runs on each
    prompt; it returns at once, starts a refresh in the background only when a commit has landed
    since the last one, and prints nothing: a prompt gives the agent no line, since the journal's
    own count of searches is its one reminder."""

    name = "tick"

    def command(self, arguments: Namespace, caller: Caller) -> RefreshTool:
        return RefreshTool(arguments.tool_name, arguments.folder, True)

    def write_output(self, value: object, output: Output) -> None:
        return None
