from dataclasses import dataclass
from typing import ClassVar


@dataclass(frozen=True, kw_only=True)
class ViewModel:
    """A read-only row of a database view; the class names the view, its key column and its SELECT."""

    cli_name: ClassVar[str]
    view: ClassVar[str]
    key: ClassVar[str]
    select: ClassVar[str]
