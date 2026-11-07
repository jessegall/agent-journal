from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.mcp.commands.add_server.add_server import AddServer
from core.modules.mcp.models.mcp_server import McpServer


class AddServerSubcommand(Subcommand[AddServer, McpServer]):
    """`journal mcp add <name> <address or command>`: a server the catalogue does not suggest, written into
    .mcp.json and .codex/config.toml."""

    cli_name = "mcp"
    name = "add"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("name")
        parser.add_argument("target")

    def command(self, arguments: Namespace, caller: Caller) -> AddServer:
        return AddServer(arguments.name, arguments.target)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, McpServer):
            output.line(f"added {value.name}")
