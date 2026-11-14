from argparse import ArgumentParser, Namespace
from collections.abc import Sequence

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from engine.types.type_guards import is_tuple
from core.modules.mcp.models.mcp_server import McpServer
from core.modules.mcp.queries.mcp_server_query import McpServerQuery
from core.modules.mcp.support.server_standing import ServerStanding


class McpListSubcommand(ReadSubcommand[Sequence[tuple[McpServer, str]]]):
    """`journal mcp list`: the installed servers, oldest first, with how each stands."""

    cli_name = "mcp"
    name = "list"

    def __init__(self, servers: McpServerQuery, standing: ServerStanding) -> None:
        self.servers, self.standing = servers, standing

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def read(self, arguments: Namespace, caller: Caller) -> Sequence[tuple[McpServer, str]]:
        return tuple((server, self.standing.standing(server)) for server in self.servers.oldest().get())

    def write_output(self, value: object, output: Output) -> None:
        listed = [(pair[0], str(pair[1])) for pair in value if is_tuple(pair) and isinstance(pair[0], McpServer)] if is_tuple(value) else []
        output.write("\n".join(f"{server.name}  {standing}  {server.title}" for server, standing in listed) or "no servers installed",
                     {"rows": [{**output.values(server), "standing": standing} for server, standing in listed]})
