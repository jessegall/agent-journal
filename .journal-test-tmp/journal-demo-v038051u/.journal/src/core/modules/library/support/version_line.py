from collections.abc import Mapping
from dataclasses import dataclass

from core.modules.library.support.library_unreachable_error import LibraryUnreachableError


@dataclass(frozen=True)
class VersionLine:
    """One change of an item on the server: its version, what was done, who did it and with which token."""

    version: int
    action: str
    user: str
    token: str
    created_at: str

    @classmethod
    def parsed(cls, body: object) -> "VersionLine":
        if not isinstance(body, dict):
            raise LibraryUnreachableError.unreadable()
        try:
            return cls(int(body["version"]), str(body["action"]), str(body["user"]), str(body.get("token", "")), str(body["created_at"]))
        except (KeyError, TypeError, ValueError) as error:
            raise LibraryUnreachableError.unreadable() from error

    def line(self) -> str:
        token = f" with token {self.token!r}" if self.token else ""
        return f"version {self.version}  {self.action}  {self.user}{token}  {self.created_at}"

    def json(self) -> Mapping[str, object]:
        return {"version": self.version, "action": self.action, "user": self.user, "token": self.token, "created_at": self.created_at}
