from dataclasses import dataclass

from core.modules.mcp.models.enums.server_auth import ServerAuth
from core.modules.mcp.models.mcp_server import STDIO


@dataclass(frozen=True)
class ServerSuggestion:
    """An MCP server worth offering, with what it is for and how it is let in."""

    name: str
    title: str
    subject: str
    transport: str = STDIO
    command: str = ""
    args: tuple[str, ...] = ()
    url: str = ""
    key_variable: str = ""
    auth: ServerAuth = ServerAuth.NONE
    has_transcripts: bool = False

    @property
    def admission(self) -> str:
        if self.auth is ServerAuth.KEY:
            return f" (key: {self.key_variable})"
        return " (signs in on its own)" if self.auth is ServerAuth.OAUTH else ""
