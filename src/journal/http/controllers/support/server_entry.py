from dataclasses import dataclass


@dataclass(frozen=True)
class ServerEntry:
    """An MCP server as the MCP page lists it: how it runs, the key it needs and whether it has it, how it stands, and whether the journal manages it."""

    name: str
    title: str
    transport: str
    state: str
    managed: bool
    command: str = ""
    url: str = ""
    auth: str = "none"
    key_var: str = ""
    has_key: bool = False
    last_error: str = ""

    def origin(self, threshold: str) -> bool:
        return bool(threshold) and threshold in f"{self.command} {self.url}"
