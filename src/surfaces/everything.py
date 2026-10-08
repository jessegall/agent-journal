from dataclasses import dataclass

from controllers.types import CONTROLLERS
from resources.base import Refused
from features.open_viewer.attachments import listed_types


@dataclass(frozen=True)
class Hit:
    row: object
    files: tuple[tuple[str, object], ...]

    @property
    def type(self) -> str:
        return self.row.type


def chosen(resources: tuple[str, ...]) -> list[str]:
    """The types a search covers: all of them, or the ones named, which must exist."""
    every = listed_types()
    unknown = [name for name in resources if name not in every]
    if unknown:
        raise Refused(f"there is no resource type {', '.join(unknown)} to search; the types are {', '.join(every)}")
    return [type_ for type_ in every if not resources or type_ in resources]


def found(record, actor: str, term: str, archived: bool = False, resources: tuple[str, ...] = ()) -> list[Hit]:
    """Every row of the chosen types that holds the term, with the attached files whose name or tags hold it: the one search the viewer and journal search share."""
    want = term.lower()
    return [Hit(row, tuple((name, tags) for name, tags in row.files.items() if want in name.lower() or want in str(tags).lower()))
            for type_ in chosen(resources) for row in CONTROLLERS[type_](record, actor=actor).search(term, archived)]
