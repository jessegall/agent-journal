from collections.abc import Sequence
from pathlib import Path

from engine.json.json_settings import JsonSettings
from engine.types.type_guards import is_mapping
from core.base.provider.tool_server import ToolServer
from core.base.provider.program_server_file import ProgramServerFile

FILE = Path(".mcp.json")
SERVERS = "mcpServers"


class ClaudeServerFile(ProgramServerFile):
    """The project's .mcp.json, which Claude Code reads its servers from: the journal's servers written over
    their own names beside every other server and setting the file holds, a key only as ${VARIABLE}."""

    def __init__(self, folder: Path) -> None:
        super().__init__(folder / FILE)

    def names(self) -> set[str]:
        return set(self.stored_servers(self.read()))

    def prepare(self, servers: Sequence[ToolServer]) -> None:
        settings = self.read()
        self.write_settings(settings, servers, tuple(self.stored_servers(settings)))

    def write(self, servers: Sequence[ToolServer], dropped: Sequence[str]) -> None:
        self.write_settings(self.read(), servers, dropped)

    def write_settings(self, settings: dict[str, object], servers: Sequence[ToolServer], dropped: Sequence[str]) -> None:
        kept = {name: entry for name, entry in self.stored_servers(settings).items() if name not in dropped}
        settings[SERVERS] = {**kept, **{server.name: self.entry(server) for server in servers}}
        JsonSettings.write(self.path, settings)

    def read(self) -> dict[str, object]:
        return JsonSettings.read(self.path)

    @staticmethod
    def stored_servers(settings: dict[str, object]) -> dict[str, object]:
        servers = settings.get(SERVERS, {})
        return {str(key): value for key, value in servers.items()} if is_mapping(servers) else {}

    @staticmethod
    def entry(server: ToolServer) -> dict[str, object]:
        reference = f"${{{server.key_variable}}}"
        if server.is_started:
            return ClaudeServerFile.present(command=server.command, args=list(server.args), env={server.key_variable: reference} if server.needs_key else None)
        return ClaudeServerFile.present(type=server.transport, url=server.url, headers={"Authorization": f"Bearer {reference}"} if server.needs_key else None)

    @staticmethod
    def present(**entry_fields: object) -> dict[str, object]:
        return {name: value for name, value in entry_fields.items() if value is not None}
