from collections.abc import Mapping, Sequence
from dataclasses import dataclass

from core.modules.library.support.library_token import LibraryToken
from core.modules.library.support.library_answer import LibraryAnswer


@dataclass(frozen=True)
class LibraryTokens:
    """The tokens of one user of the shared server, with label and last use."""

    tokens: tuple[LibraryToken, ...]

    @classmethod
    def parsed(cls, body: object) -> "LibraryTokens":
        return cls(tuple(LibraryToken.parsed(token) for token in LibraryAnswer.members(body, "tokens")))

    def lines(self) -> Sequence[str]:
        return [token.line() for token in self.tokens] or ["no tokens"]

    def json(self) -> Mapping[str, object]:
        return {"tokens": [token.json() for token in self.tokens]}
