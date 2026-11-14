from dataclasses import dataclass

from core.modules.library.support.library_answer import LibraryAnswer


@dataclass(frozen=True)
class StateEntry:
    """One line of the server's list of items: the item's share, number and version, and whether it is removed."""

    share: str
    item_id: int
    version: int
    is_removed: bool

    @classmethod
    def parsed(cls, body: object) -> "StateEntry":
        fields = LibraryAnswer.fields(body)
        return cls(str(fields["kind"]), LibraryAnswer.number(fields["id"]), LibraryAnswer.number(fields["version"]), bool(fields["removed"]))
