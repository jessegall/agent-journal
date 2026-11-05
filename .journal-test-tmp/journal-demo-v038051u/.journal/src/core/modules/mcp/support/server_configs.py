from collections.abc import Sequence
from pathlib import Path

from core.base.query.queries import Queries
from core.modules.mcp.models.mcp_server import McpServer
from core.modules.mcp.support.claude_server_file import FILE as CLAUDE_FILE, ClaudeServerFile
from core.modules.mcp.support.codex_server_file import FILE as CODEX_FILE, CodexServerFile


class ServerConfigs:
    """The one writer of the agent programs' server configs: every installed server written into Claude Code's
    .mcp.json and Codex's .codex/config.toml, and a removed one taken out of both."""

    def __init__(self, queries: Queries, claude: ClaudeServerFile, codex: CodexServerFile) -> None:
        self.queries, self.claude, self.codex = queries, claude, codex

    def write(self, dropped: Sequence[str] = ()) -> None:
        servers = self.installed(dropped)
        self.claude.write(servers, dropped)
        self.codex.write(servers)

    def write_folder(self, folder: Path) -> tuple[Path, ...]:
        servers = self.installed()
        previous = tuple(ClaudeServerFile.read_file(folder / CLAUDE_FILE).get("mcpServers", {}))
        ClaudeServerFile.write_file(folder / CLAUDE_FILE, servers, previous)
        CodexServerFile.write_file(folder / CODEX_FILE, servers)
        return CLAUDE_FILE, CODEX_FILE

    def installed(self, dropped: Sequence[str] = ()) -> list[McpServer]:
        return [server for server in self.queries.query(McpServer).oldest().all_rows() if server.name not in dropped]
