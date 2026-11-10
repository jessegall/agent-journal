from collections.abc import Mapping, Sequence
from typing import NotRequired, TypedDict


class WindowSearchEntry(TypedDict):
    """A window's search in the registry: a model searcher or read command with matching fields, plus the
    bar's placeholder, menu and button."""

    searcher: NotRequired[str]
    read: NotRequired[str]
    fields: NotRequired[Sequence[str]]
    placeholder: str
    context: Sequence[Mapping[str, object]]
    button: Mapping[str, object]
