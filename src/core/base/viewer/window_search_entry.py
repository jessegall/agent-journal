from collections.abc import Mapping, Sequence
from typing import TypedDict


class WindowSearchEntry(TypedDict):
    """A window's search as the registry holds it: the searcher's path, the field's placeholder, its menu and the
    button beside it, empty when there is none."""

    searcher: str
    placeholder: str
    context: Sequence[Mapping[str, object]]
    button: Mapping[str, object]
