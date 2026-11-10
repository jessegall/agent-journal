from collections.abc import Mapping
from dataclasses import dataclass

from core.modules.library.models.enums.library_role import LibraryRole
from core.modules.library.support.library_answer import LibraryAnswer
from core.modules.library.errors.library_unreachable_error import LibraryUnreachableError


USER_PART = "user"


@dataclass(frozen=True)
class LibraryUser:
    """One user of the shared server: its number, name and role, and when the user was removed, if so."""

    user_id: int
    name: str
    role: LibraryRole
    removed_at: str

    @classmethod
    def parsed(cls, body: object) -> "LibraryUser":
        fields = LibraryAnswer.fields(body)
        try:
            return cls(LibraryAnswer.number(fields["id"]), str(fields["name"]), LibraryRole(fields["role"]), str(fields.get("removed_at", "")))
        except (KeyError, TypeError, ValueError) as error:
            raise LibraryUnreachableError.unreadable() from error

    @classmethod
    def answered(cls, body: object) -> "LibraryUser":
        return cls.parsed(LibraryAnswer.member(body, USER_PART))

    def line(self) -> str:
        return f"user {self.user_id}: {self.name}, {self.role.value}" + (", removed" if self.removed_at else "")

    def json(self) -> Mapping[str, object]:
        return {"id": self.user_id, "name": self.name, "role": self.role.value, "removed_at": self.removed_at}
