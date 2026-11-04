from dataclasses import dataclass

from core.modules.library.support.library_unreachable_error import LibraryUnreachableError


@dataclass(frozen=True)
class ServerInfo:
    """What the shared server says about itself without a token: its key, its name and the protocol it speaks."""

    server_key: str
    name: str
    protocol: str

    @classmethod
    def parsed(cls, body: object) -> "ServerInfo":
        if not isinstance(body, dict):
            raise LibraryUnreachableError.unreadable()
        try:
            return cls(str(body["server_key"]), str(body["name"]), str(body["protocol"]))
        except KeyError as error:
            raise LibraryUnreachableError.unreadable() from error
