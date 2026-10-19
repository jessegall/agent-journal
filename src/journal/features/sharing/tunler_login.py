from dataclasses import dataclass


@dataclass(frozen=True)
class TunlerLogin:
    """How a login went: connected, or why not, and whether the server asks for its master password to make the account."""

    connected: bool
    needs_master: bool = False
    error: str = ""
