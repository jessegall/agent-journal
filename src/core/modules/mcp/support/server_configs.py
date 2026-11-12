from collections.abc import Sequence
from pathlib import Path

from engine.query.queries import Queries
from engine.database.kept_rows import KeptRows
from engine.journal.journal_home import JournalHome
from engine.provider.providers import Providers
from engine.provider.program_server_file import ProgramServerFile
from core.modules.mcp.models.mcp_server import McpServer


class ServerConfigs:
    """Writes installed servers through each registered program's configuration files."""

    def __init__(self, queries: Queries, providers: Providers, home: JournalHome, kept: KeptRows) -> None:
        self.queries, self.providers, self.home, self.kept = queries, providers, home, kept

    def files(self, folder: Path) -> tuple[ProgramServerFile, ...]:
        return tuple(file for provider in self.providers.all() for file in provider.server_files(folder))

    def names(self) -> dict[str, set[str]]:
        return {str(file.path.relative_to(self.home.project_folder)): file.names() for file in self.files(self.home.project_folder)}

    def write(self, dropped: Sequence[str] = ()) -> None:
        servers = self.installed(dropped)
        for file in self.files(self.home.project_folder):
            file.write(servers, dropped)

    def write_folder(self, folder: Path) -> tuple[Path, ...]:
        servers = self.installed()
        files = self.files(folder)
        for file in files:
            file.prepare(servers)
        return tuple(file.path.relative_to(folder) for file in files)

    def installed(self, dropped: Sequence[str] = ()) -> list[McpServer]:
        installed = self.queries.query(McpServer).oldest()
        servers = self.kept.read(installed, lambda: tuple(installed.all_rows()), name="mcp.installed_servers")
        return [server for server in servers if server.name not in dropped]
