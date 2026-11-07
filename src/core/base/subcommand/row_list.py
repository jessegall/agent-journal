from collections.abc import Mapping, Sequence
from dataclasses import dataclass


@dataclass(frozen=True)
class RowList:
    """The rows of a read that are worked out rather than kept in a table, each with its own id."""

    rows: Sequence[Mapping[str, object]]

    def json(self) -> Mapping[str, object]:
        return {"rows": list(self.rows), "is_last_page": True}
