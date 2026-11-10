from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.mcp.commands.give_server_key.give_server_key import GiveServerKey
from core.modules.mcp.models.mcp_server import McpServer


class GiveServerKeySubcommand(Subcommand[GiveServerKey, McpServer]):
    """`journal mcp key <name> <value>`: the key a server signs in with, kept outside the project."""

    cli_name = "mcp"
    name = "key"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("name")
        parser.add_argument("value")

    def command(self, arguments: Namespace, caller: Caller) -> GiveServerKey:
        return GiveServerKey(arguments.name, arguments.value)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, McpServer):
            output.line(f"key kept for {value.name}, outside the project")
