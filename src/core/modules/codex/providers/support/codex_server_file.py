from core.base.file_access import FileAccess
import json
import re
import tomllib
from collections.abc import Sequence
from pathlib import Path

from core.base.provider.tool_server import ToolServer
from core.base.provider.program_server_file import ProgramServerFile

FILE = Path(".codex") / "config.toml"
BEGIN = "# agent-journal mcp servers: written by the journal, changed with journal mcp"
END = "# end of agent-journal mcp servers"
OLDER_WRITER_LINE = "# Written by the journal: edit it on the viewer's MCP page."
SERVER_TABLE = re.compile(r'\[mcp_servers\."?([^".\]]+)"?\]')


class CodexServerFile(ProgramServerFile):
    """The project's .codex/config.toml, which Codex reads its servers from: the journal's servers in one
    block of their own, written anew each time, beside everything else the file holds, less any older table
    of the same server, which Codex refuses as a duplicate; a key only by its variable's name, which Codex
    passes on from its own environment."""

    def __init__(self, folder: Path) -> None:
        super().__init__(folder / FILE)

    def names(self) -> set[str]:
        return set(tomllib.loads(FileAccess.shared().read(self.path)).get("mcp_servers", {})) if self.path.is_file() else set()

    def write(self, servers: Sequence[ToolServer], dropped: Sequence[str]) -> None:
        self.write_file(self.path, servers)

    @staticmethod
    def write_file(path: Path, servers: Sequence[ToolServer]) -> None:
        text = FileAccess.shared().read(path) if path.is_file() else ""
        leading_text, _, block_text = text.partition(BEGIN)
        trailing_text = block_text.partition(END)[2]
        block = "\n".join([BEGIN, *(CodexServerFile.table(server) for server in servers), END]) if servers else ""
        names = {server.name for server in servers}
        kept = (CodexServerFile.without_tables(leading_text, names), block, CodexServerFile.without_tables(trailing_text, names))
        path.parent.mkdir(parents=True, exist_ok=True)
        FileAccess.shared().write(path, "\n".join(part.strip("\n") for part in kept if part.strip()) + "\n")

    @staticmethod
    def without_tables(text: str, names: set[str]) -> str:
        kept: list[str] = []
        removing = False
        for line in text.splitlines():
            table = SERVER_TABLE.fullmatch(line.strip())
            if line.startswith("["):
                removing = table is not None and table[1] in names
            if not removing and line.strip() != OLDER_WRITER_LINE:
                kept.append(line)
        return "\n".join(kept)

    @staticmethod
    def table(server: ToolServer) -> str:
        lines = [f"[mcp_servers.{json.dumps(server.name)}]"]
        if server.is_started:
            lines += [f"command = {json.dumps(server.command)}", f"args = {json.dumps(list(server.args))}"]
            lines += [f"env_vars = {json.dumps([server.key_variable])}"] if server.needs_key else []
        else:
            lines += [f"url = {json.dumps(server.url)}"]
            lines += [f"bearer_token_env_var = {json.dumps(server.key_variable)}"] if server.needs_key else []
        return "\n".join(lines)
