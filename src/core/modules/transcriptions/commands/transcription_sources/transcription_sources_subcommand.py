from argparse import ArgumentParser, Namespace
from collections.abc import Sequence

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from engine.types.type_guards import is_tuple
from core.modules.mcp.models.mcp_server import McpServer
from core.modules.mcp.queries.mcp_server_query import McpServerQuery
from core.modules.mcp.support.server_catalogue import ServerCatalogue


class TranscriptionSourcesSubcommand(ReadSubcommand[Sequence[McpServer]]):
    """`journal transcription sources`: the installed MCP servers transcriptions can be fetched from."""

    cli_name = "transcription"
    name = "sources"

    def __init__(self, servers: McpServerQuery, catalogue: ServerCatalogue) -> None:
        self.servers, self.catalogue = servers, catalogue

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def read(self, arguments: Namespace, caller: Caller) -> Sequence[McpServer]:
        names = {suggestion.name for suggestion in self.catalogue.with_transcripts()}
        return tuple(server for server in self.servers.all_rows() if server.name in names)

    def write_output(self, value: object, output: Output) -> None:
        listed = [row for row in value if isinstance(row, McpServer)] if is_tuple(value) else []
        output.write("\n".join(f"{row.name}  {row.title}" for row in listed) or "no installed server has transcriptions", {"rows": [output.values(row) for row in listed]})
