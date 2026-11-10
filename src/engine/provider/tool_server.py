from collections.abc import Sequence
from typing import Protocol


class ToolServer(Protocol):
    """The server details an agent program writes into its configuration."""

    @property
    def name(self) -> str: ...

    @property
    def command(self) -> str: ...

    @property
    def args(self) -> Sequence[str]: ...

    @property
    def transport(self) -> str: ...

    @property
    def url(self) -> str: ...

    @property
    def key_variable(self) -> str: ...

    @property
    def needs_key(self) -> bool: ...

    @property
    def is_started(self) -> bool: ...
