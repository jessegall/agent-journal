from collections.abc import Mapping, Sequence
from dataclasses import dataclass

from core.modules.library.support.library_answer import LibraryAnswer
from core.modules.library.support.library_user import LibraryUser


@dataclass(frozen=True)
class LibraryUsers:
    """The users of the shared server, as a person who administers it reads them."""

    users: tuple[LibraryUser, ...]

    @classmethod
    def parsed(cls, body: object) -> "LibraryUsers":
        return cls(tuple(LibraryUser.parsed(user) for user in LibraryAnswer.members(body, "users")))

    def lines(self) -> Sequence[str]:
        return [user.line() for user in self.users] or ["no users"]

    def json(self) -> Mapping[str, object]:
        return {"users": [user.json() for user in self.users]}
