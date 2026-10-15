from dataclasses import dataclass, field

from journal.models.model import Model


@dataclass(frozen=True)
class McpServer(Model):
    """An MCP server the project's agents are given: how to start or reach it, the key it needs, and how it stood when last checked."""

    name: str = ""
    title: str = ""
    transport: str = "stdio"
    command: str = ""
    args: tuple[str, ...] = ()
    url: str = ""
    key_var: str = ""
    """The environment variable the server reads its key from; empty when it needs none or signs in on its own."""
    auth: str = "none"
    """none, key or oauth: how the server is let in."""
    state: str = "installed"
    """installed, needs_key, connected, needs_auth or failed, as the last check found it."""
    last_error: str = ""

    def checked(self, state: str, error: str) -> "McpServer":
        return self.with_(state=state, last_error=error)

    def shape(self) -> dict:
        """The server as the provider's configuration names it; a key is referred to by its variable, never written down."""
        if self.transport == "stdio":
            return {"command": self.command, "args": list(self.args), **({"env": {self.key_var: f"${{{self.key_var}}}"}} if self.key_var else {})}
        return {"type": self.transport, "url": self.url, **({"headers": {"Authorization": f"Bearer ${{{self.key_var}}}"}} if self.key_var else {})}
