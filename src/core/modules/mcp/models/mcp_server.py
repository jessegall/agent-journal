from dataclasses import dataclass

from engine.model.model import Model
from core.modules.mcp.models.enums.server_auth import ServerAuth

STDIO = "stdio"


@dataclass(frozen=True, kw_only=True)
class McpServer(Model):
    """An MCP server the project's agents use: how it is started or reached and the variable its key is given
    in; the key itself lives outside the project, never in a row."""

    model_name = "mcp_server"
    cli_name = "mcp"
    search_fields = ["name", "title"]

    creator_id: int
    name: str
    title: str
    transport: str = STDIO
    command: str = ""
    args: tuple[str, ...] = ()
    url: str = ""
    key_variable: str = ""
    auth: ServerAuth = ServerAuth.NONE

    @property
    def needs_key(self) -> bool:
        return self.auth is ServerAuth.KEY

    @property
    def is_started(self) -> bool:
        return self.transport == STDIO
