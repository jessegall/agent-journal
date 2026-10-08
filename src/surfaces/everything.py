from dataclasses import dataclass

from controllers.types import CONTROLLERS
from surfaces.attachments import listed_types


@dataclass(frozen=True)
class Hit:
    row: object
    files: tuple[tuple[str, object], ...]

    @property
    def type(self) -> str:
        return self.row.type


def found(record, actor: str, term: str, archived: bool = False) -> list[Hit]:
    """Every row of every type that holds the term, with the attached files whose name or tags hold it: the one search the viewer and journal search share."""
    want = term.lower()
    return [Hit(row, tuple((name, tags) for name, tags in row.files.items() if want in name.lower() or want in str(tags).lower()))
            for type_ in listed_types() for row in CONTROLLERS[type_](record, actor=actor).search(term, archived)]
