from dataclasses import dataclass


@dataclass(frozen=True)
class ListedServer:
    """An MCP server as the MCP page lists it: how it runs, the key it needs and whether it has it, how it stands, and whether the journal manages it."""

    name: str
    title: str
    transport: str
    command: str
    url: str
    auth: str
    key_var: str
    has_key: bool
    state: str
    last_error: str
    managed: bool

    def runs_from(self, mark: str) -> bool:
        return bool(mark) and mark in f"{self.command} {self.url}"
