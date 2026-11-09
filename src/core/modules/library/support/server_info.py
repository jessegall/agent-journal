from dataclasses import dataclass

from core.modules.library.support.library_answer import LibraryAnswer
from core.modules.library.support.library_unreachable_error import LibraryUnreachableError


@dataclass(frozen=True)
class ServerInfo:
    """What the shared server says about itself without a token: its key, its name and the protocol it speaks."""

    server_key: str
    name: str
    protocol: str

    @classmethod
    def parsed(cls, body: object) -> "ServerInfo":
        fields = LibraryAnswer.fields(body)
        try:
            return cls(str(fields["server_key"]), str(fields["name"]), str(fields["protocol"]))
        except KeyError as error:
            raise LibraryUnreachableError.unreadable() from error
