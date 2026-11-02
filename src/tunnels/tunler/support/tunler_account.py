from collections.abc import Mapping
from dataclasses import dataclass


@dataclass(frozen=True)
class TunlerAccount:
    """What the Tunler window shows about this machine: its status, the subdomain this journal asks for, and
    whether this journal uses tunler."""

    installed: bool
    authenticated: bool
    rejected: bool
    account: str | None
    host: str | None
    command: str | None
    subdomain: str | None
    is_used: bool

    def json(self) -> Mapping[str, object]:
        return {"installed": self.installed, "authenticated": self.authenticated, "rejected": self.rejected, "account": self.account, "host": self.host,
                "command": self.command, "subdomain": self.subdomain, "is_used": self.is_used}
