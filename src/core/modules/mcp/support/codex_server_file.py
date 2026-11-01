import json
import tomllib
from collections.abc import Sequence
from pathlib import Path

from core.base.journal_home import JournalHome
from core.modules.mcp.models.mcp_server import McpServer

FILE = Path(".codex") / "config.toml"
BEGIN = "# agent-journal mcp servers: written by the journal, changed with journal mcp"
END = "# end of agent-journal mcp servers"


class CodexServerFile:
    """The project's .codex/config.toml, which Codex reads its servers from: the journal's servers in one block of
    their own, written anew each time, beside everything else the file holds; a key only by its variable's
    name, which Codex passes on from its own environment."""

    def __init__(self, home: JournalHome) -> None:
        self.path = home.project_folder / FILE

    def names(self) -> set[str]:
        return set(tomllib.loads(self.path.read_text()).get("mcp_servers", {})) if self.path.is_file() else set()

    def write(self, servers: Sequence[McpServer]) -> None:
        text = self.path.read_text() if self.path.is_file() else ""
        before, _, rest = text.partition(BEGIN)
        after = rest.partition(END)[2] if rest else ""
        block = "\n".join([BEGIN, *(self.table(server) for server in servers), END]) if servers else ""
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.path.write_text("\n".join(part.strip("\n") for part in (before, block, after) if part.strip()) + "\n")

    @staticmethod
    def table(server: McpServer) -> str:
        lines = [f"[mcp_servers.{json.dumps(server.name)}]"]
        if server.is_started:
            lines += [f"command = {json.dumps(server.command)}", f"args = {json.dumps(list(server.args))}"]
            lines += [f"env_vars = {json.dumps([server.key_variable])}"] if server.needs_key else []
        else:
            lines += [f"url = {json.dumps(server.url)}"]
            lines += [f"bearer_token_env_var = {json.dumps(server.key_variable)}"] if server.needs_key else []
        return "\n".join(lines)
