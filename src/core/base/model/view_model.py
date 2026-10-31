from dataclasses import dataclass
from typing import ClassVar


@dataclass(frozen=True, kw_only=True)
class ViewModel:
    """A read-only row from a database view."""

    cli_name: ClassVar[str]
    view: ClassVar[str]
    key: ClassVar[str]
