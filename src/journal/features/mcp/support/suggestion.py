from dataclasses import dataclass

from journal.models.mcp_server import McpServer


@dataclass(frozen=True)
class Suggestion:
    """An MCP server worth offering, with what it is for and how it is let in."""

    name: str
    title: str
    subject: str
    transport: str = "stdio"
    command: str = ""
    args: tuple[str, ...] = ()
    url: str = ""
    key_var: str = ""
    auth: str = "none"

    @property
    def admit(self) -> str:
        if self.auth == "key":
            return f" (key: {self.key_var})"
        return " (signs in on its own)" if self.auth == "oauth" else ""

    def server(self) -> McpServer:
        return McpServer(name=self.name, title=self.title, transport=self.transport, command=self.command, args=self.args, url=self.url, key_var=self.key_var, auth=self.auth, state="needs_key" if self.auth == "key" else "installed")
