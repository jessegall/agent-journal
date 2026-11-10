from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.mcp.commands.remove_server.remove_server import RemoveServer
from core.modules.mcp.models.mcp_server import McpServer


class RemoveServerSubcommand(Subcommand[RemoveServer, McpServer]):
    """`journal mcp remove <name>`: the server out of both configs, and its key dropped."""

    cli_name = "mcp"
    name = "remove"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("name")

    def command(self, arguments: Namespace, caller: Caller) -> RemoveServer:
        return RemoveServer(arguments.name)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, McpServer):
            output.line(f"removed {value.name}")
