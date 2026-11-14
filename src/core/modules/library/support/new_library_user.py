from collections.abc import Mapping
from dataclasses import dataclass

from core.modules.library.support.library_token import LibraryToken
from core.modules.library.support.library_answer import LibraryAnswer
from core.modules.library.errors.library_unreachable_error import LibraryUnreachableError
from core.modules.library.support.library_user import LibraryUser


@dataclass(frozen=True)
class NewLibraryUser:
    """A user just added to the shared server, with the text of its first token, which the server shows once and
    this journal prints and keeps nowhere."""

    user: LibraryUser
    token: LibraryToken
    token_text: str

    @classmethod
    def parsed(cls, body: object) -> "NewLibraryUser":
        fields = LibraryAnswer.fields(body)
        try:
            return cls(LibraryUser.parsed(fields["user"]), LibraryToken.parsed(fields["token"]), str(fields["token_text"]))
        except KeyError as error:
            raise LibraryUnreachableError.unreadable() from error

    def line(self) -> str:
        return f"{self.user.line()}\ntoken (shown once): {self.token_text}"

    def json(self) -> Mapping[str, object]:
        return {"user": self.user.json(), "token": self.token.json(), "token_text": self.token_text}
