from dataclasses import dataclass

from core.modules.library.support.library_unreachable import LibraryUnreachable


@dataclass(frozen=True)
class ServerInfo:
    """What the shared server says about itself without a token: its key, its name and the protocol it speaks."""

    server_key: str
    name: str
    protocol: str

    @classmethod
    def parsed(cls, body: object) -> "ServerInfo":
        if not isinstance(body, dict):
            raise LibraryUnreachable.unreadable()
        try:
            return cls(str(body["server_key"]), str(body["name"]), str(body["protocol"]))
        except KeyError as error:
            raise LibraryUnreachable.unreadable() from error
