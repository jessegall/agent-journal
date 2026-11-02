from collections.abc import Mapping
from dataclasses import dataclass


@dataclass(frozen=True)
class TunlerLogin:
    """How a login went: connected, or it needs the master password to make the account, or tunler's own
    words."""

    connected: bool
    needs_master: bool = False
    error: str = ""

    def json(self) -> Mapping[str, object]:
        return {"connected": self.connected, "needs_master": self.needs_master, "error": self.error}
