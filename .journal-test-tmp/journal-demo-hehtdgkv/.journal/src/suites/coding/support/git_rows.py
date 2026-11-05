from collections.abc import Mapping, Sequence
from dataclasses import dataclass


@dataclass(frozen=True)
class GitRows:
    """A page of what the Git window lists, and whether it is the last page."""

    rows: Sequence[Mapping[str, object]]
    is_last_page: bool

    def json(self) -> Mapping[str, object]:
        return {"rows": list(self.rows), "is_last_page": self.is_last_page}
