from dataclasses import dataclass
from typing import ClassVar


@dataclass(frozen=True, kw_only=True)
class ViewModel:
    """The base of every row read from a view: read-only, with no id, version or moments, found by its own key
    column."""

    cli_noun: ClassVar[str]
    view: ClassVar[str]
    key: ClassVar[str]
