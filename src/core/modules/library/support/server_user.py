from dataclasses import dataclass

from core.modules.library.models.enums.library_role import LibraryRole
from core.modules.library.support.library_unreachable import LibraryUnreachable


@dataclass(frozen=True)
class ServerUser:
    """The user a token belongs to on the shared server, and the role the server gives them."""

    name: str
    role: LibraryRole

    @classmethod
    def parsed(cls, body: object) -> "ServerUser":
        if not isinstance(body, dict):
            raise LibraryUnreachable.unreadable()
        try:
            return cls(str(body["name"]), LibraryRole(body["role"]))
        except (KeyError, ValueError) as error:
            raise LibraryUnreachable.unreadable() from error
