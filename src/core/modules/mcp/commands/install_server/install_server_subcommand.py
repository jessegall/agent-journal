from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.mcp.commands.install_server.install_server import InstallServer
from core.modules.mcp.models.mcp_server import McpServer


class InstallServerSubcommand(Subcommand[InstallServer, McpServer]):
    """`journal mcp install <name>`: a suggested server, written into .mcp.json and .codex/config.toml."""

    cli_name = "mcp"
    name = "install"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("name")

    def command(self, arguments: Namespace, caller: Caller) -> InstallServer:
        return InstallServer(arguments.name)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, McpServer):
            output.line(f"installed {value.name}" + (f": it needs its key, journal mcp key {value.name} <value>" if value.needs_key else ""))
