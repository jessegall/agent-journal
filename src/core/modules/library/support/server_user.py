from dataclasses import dataclass

from core.modules.library.models.enums.library_role import LibraryRole
from core.modules.library.support.library_answer import LibraryAnswer
from core.modules.library.errors.library_unreachable_error import LibraryUnreachableError


@dataclass(frozen=True)
class ServerUser:
    """The user a token belongs to on the shared server, and the role the server gives them."""

    name: str
    role: LibraryRole

    @classmethod
    def parsed(cls, body: object) -> "ServerUser":
        fields = LibraryAnswer.fields(body)
        try:
            return cls(str(fields["name"]), LibraryRole(fields["role"]))
        except (KeyError, ValueError) as error:
            raise LibraryUnreachableError.unreadable() from error
