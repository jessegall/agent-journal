from collections.abc import Mapping, Sequence
from dataclasses import dataclass

from core.modules.library.support.library_unreachable_error import LibraryUnreachableError
from core.modules.library.support.version_line import VersionLine


@dataclass(frozen=True)
class LibraryVersions:
    """The changes of one item on the server, newest first, each with who made it."""

    changes: tuple[VersionLine, ...]

    @classmethod
    def parsed(cls, body: object) -> "LibraryVersions":
        if not isinstance(body, dict):
            raise LibraryUnreachableError.unreadable()
        try:
            return cls(tuple(VersionLine.parsed(change) for change in body["versions"]))
        except (KeyError, TypeError) as error:
            raise LibraryUnreachableError.unreadable() from error

    def lines(self) -> Sequence[str]:
        return [change.line() for change in self.changes] or ["no changes on record"]

    def json(self) -> Mapping[str, object]:
        return {"versions": [change.json() for change in self.changes]}
