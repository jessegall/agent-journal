from collections.abc import Mapping
from dataclasses import dataclass

from core.modules.library.support.library_answer import LibraryAnswer
from core.modules.library.support.library_unreachable_error import LibraryUnreachableError


TOKEN_PART = "token"


@dataclass(frozen=True)
class LibraryToken:
    """One way in for a user of the shared server: its number, label and last use, and when it was revoked. The
    server keeps no text of it."""

    token_id: int
    user_id: int
    label: str
    last_used_at: str
    revoked_at: str

    @classmethod
    def parsed(cls, body: object) -> "LibraryToken":
        if not isinstance(body, dict):
            raise LibraryUnreachableError.unreadable()
        try:
            return cls(int(body["id"]), int(body["user_id"]), str(body.get("label", "")), str(body.get("last_used_at", "")), str(body.get("revoked_at", "")))
        except (KeyError, TypeError, ValueError) as error:
            raise LibraryUnreachableError.unreadable() from error

    @classmethod
    def answered(cls, body: object) -> "LibraryToken":
        return cls.parsed(LibraryAnswer.member(body, TOKEN_PART))

    def line(self) -> str:
        used = f"last used {self.last_used_at}" if self.last_used_at else "never used"
        return f"token {self.token_id}: {self.label or 'no label'}, {used}" + (f", revoked {self.revoked_at}" if self.revoked_at else "")

    def json(self) -> Mapping[str, object]:
        return {"id": self.token_id, "user_id": self.user_id, "label": self.label, "last_used_at": self.last_used_at, "revoked_at": self.revoked_at}
