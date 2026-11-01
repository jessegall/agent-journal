import json
from collections.abc import Sequence
from pathlib import Path

from core.base.journal_home import JournalHome
from core.modules.mcp.models.mcp_server import McpServer

FILE = Path(".mcp.json")
SERVERS = "mcpServers"


class ClaudeServerFile:
    """The project's .mcp.json, which Claude Code reads its servers from: the journal's servers written over their
    own names beside every other server and setting the file holds, a key only as ${VARIABLE}."""

    def __init__(self, home: JournalHome) -> None:
        self.path = home.project_folder / FILE

    def names(self) -> set[str]:
        return set(self.read().get(SERVERS, {}))

    def write(self, servers: Sequence[McpServer], dropped: Sequence[str]) -> None:
        settings = self.read()
        kept = {name: entry for name, entry in settings.get(SERVERS, {}).items() if name not in dropped}
        settings[SERVERS] = {**kept, **{server.name: self.entry(server) for server in servers}}
        self.path.write_text(json.dumps(settings, indent=2) + "\n")

    def read(self) -> dict[str, dict[str, object]]:
        return json.loads(self.path.read_text() or "{}") if self.path.is_file() else {}

    @staticmethod
    def entry(server: McpServer) -> dict[str, object]:
        reference = f"${{{server.key_variable}}}"
        if server.is_started:
            return ClaudeServerFile.present(command=server.command, args=list(server.args), env={server.key_variable: reference} if server.needs_key else None)
        return ClaudeServerFile.present(type=server.transport, url=server.url, headers={"Authorization": f"Bearer {reference}"} if server.needs_key else None)

    @staticmethod
    def present(**entry_fields: object) -> dict[str, object]:
        return {name: value for name, value in entry_fields.items() if value is not None}
