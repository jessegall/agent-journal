from core.base.file_access import FileAccess
import json
from copy import deepcopy
from functools import lru_cache
from core.base.file_version import FileVersion
from collections.abc import Sequence
from pathlib import Path

from core.base.journal_home import JournalHome
from core.base.type_guards import is_mapping
from core.modules.mcp.models.mcp_server import McpServer

FILE = Path(".mcp.json")
SERVERS = "mcpServers"


class ClaudeServerFile:
    """The project's .mcp.json, which Claude Code reads its servers from: the journal's servers written over
    their own names beside every other server and setting the file holds, a key only as ${VARIABLE}."""

    def __init__(self, home: JournalHome) -> None:
        self.path = home.project_folder / FILE

    def names(self) -> set[str]:
        return set(self.stored_servers(self.read()))

    def write(self, servers: Sequence[McpServer], dropped: Sequence[str]) -> None:
        self.write_file(self.path, servers, dropped)

    @staticmethod
    def write_file(path: Path, servers: Sequence[McpServer], dropped: Sequence[str]) -> None:
        settings = ClaudeServerFile.read_file(path)
        kept = {name: entry for name, entry in ClaudeServerFile.stored_servers(settings).items() if name not in dropped}
        settings[SERVERS] = {**kept, **{server.name: ClaudeServerFile.entry(server) for server in servers}}
        path.parent.mkdir(parents=True, exist_ok=True)
        FileAccess.shared().write(path, json.dumps(settings, indent=2) + "\n")

    def read(self) -> dict[str, object]:
        return self.read_file(self.path)

    @staticmethod
    def read_file(path: Path) -> dict[str, object]:
        if not path.is_file():
            return {}
        return deepcopy(ClaudeServerFile.loaded_settings(path, FileAccess.shared().version(path)))

    @staticmethod
    @lru_cache(maxsize=128)
    def loaded_settings(path: Path, version: FileVersion) -> dict[str, object]:
        loaded: object = json.loads(FileAccess.shared().read(path) or "{}")
        return {str(key): value for key, value in loaded.items()} if is_mapping(loaded) else {}

    @staticmethod
    def stored_servers(settings: dict[str, object]) -> dict[str, object]:
        servers = settings.get(SERVERS, {})
        return {str(key): value for key, value in servers.items()} if is_mapping(servers) else {}

    @staticmethod
    def entry(server: McpServer) -> dict[str, object]:
        reference = f"${{{server.key_variable}}}"
        if server.is_started:
            return ClaudeServerFile.present(command=server.command, args=list(server.args), env={server.key_variable: reference} if server.needs_key else None)
        return ClaudeServerFile.present(type=server.transport, url=server.url, headers={"Authorization": f"Bearer {reference}"} if server.needs_key else None)

    @staticmethod
    def present(**entry_fields: object) -> dict[str, object]:
        return {name: value for name, value in entry_fields.items() if value is not None}
