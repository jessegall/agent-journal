from collections.abc import Sequence
from typing import Protocol


class ToolServer(Protocol):
    """The server details an agent program writes into its configuration."""

    name: str
    command: str
    args: Sequence[str]
    transport: str
    url: str
    key_variable: str
    needs_key: bool
    is_started: bool
