import json
from collections.abc import Sequence
from pathlib import Path

from core.base.journal_home import JournalHome
from core.modules.mcp.models.mcp_server import McpServer

FILE = Path(".mcp.json")
SERVERS = "mcpServers"


class ClaudeServerFile:
    """The project's .mcp.json, which Claude Code reads its servers from: the journal's servers written over
    their own names beside every other server and setting the file holds, a key only as ${VARIABLE}."""

    def __init__(self, home: JournalHome) -> None:
        self.path = home.project_folder / FILE

    def names(self) -> set[str]:
        return set(self.read().get(SERVERS, {}))

    def write(self, servers: Sequence[McpServer], dropped: Sequence[str]) -> None:
        self.write_file(self.path, servers, dropped)

    @staticmethod
    def write_file(path: Path, servers: Sequence[McpServer], dropped: Sequence[str]) -> None:
        settings = ClaudeServerFile.read_file(path)
        kept = {name: entry for name, entry in settings.get(SERVERS, {}).items() if name not in dropped}
        settings[SERVERS] = {**kept, **{server.name: ClaudeServerFile.entry(server) for server in servers}}
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(settings, indent=2) + "\n")

    def read(self) -> dict[str, dict[str, object]]:
        return self.read_file(self.path)

    @staticmethod
    def read_file(path: Path) -> dict[str, dict[str, object]]:
        return json.loads(path.read_text() or "{}") if path.is_file() else {}

    @staticmethod
    def entry(server: McpServer) -> dict[str, object]:
        reference = f"${{{server.key_variable}}}"
        if server.is_started:
            return ClaudeServerFile.present(command=server.command, args=list(server.args), env={server.key_variable: reference} if server.needs_key else None)
        return ClaudeServerFile.present(type=server.transport, url=server.url, headers={"Authorization": f"Bearer {reference}"} if server.needs_key else None)

    @staticmethod
    def present(**entry_fields: object) -> dict[str, object]:
        return {name: value for name, value in entry_fields.items() if value is not None}
