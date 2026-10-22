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
    auth: str = "none"
    state: str = "installed"
    last_error: str = ""

    @classmethod
    def noun(cls) -> str:
        return "MCP server"

    def unchecked(self, state: str) -> "McpServer":
        return self.with_(state=state, last_error="")

    def checked(self, state: str, text: str) -> "McpServer":
        return self.with_(state=state, last_error=text if state == "failed" else "")

    def shape(self) -> dict:
        return self.started_shape() if self.transport == "stdio" else self.reached_shape()

    def started_shape(self) -> dict:
        return self.present(command=self.command, args=list(self.args), env={self.key_var: f"${{{self.key_var}}}"} if self.needs_key else None)

    def reached_shape(self) -> dict:
        return self.present(type=self.transport, url=self.url, headers={"Authorization": f"Bearer ${{{self.key_var}}}"} if self.needs_key else None)

    @staticmethod
    def present(**fields) -> dict:
        return {name: value for name, value in fields.items() if value is not None}

    @property
    def needs_key(self) -> bool:
        return self.auth == "key"

    def title_words(self) -> str:
        return self.title
