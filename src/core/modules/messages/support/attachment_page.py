from collections.abc import Mapping, Sequence
from dataclasses import dataclass


@dataclass(frozen=True)
class AttachmentPage:
    """A page of attached files, how many there are of each category, and whether more follow."""

    rows: Sequence[Mapping[str, object]]
    counts: Mapping[str, int]
    is_last_page: bool

    def json(self) -> Mapping[str, object]:
        return {"rows": list(self.rows), "counts": dict(self.counts), "is_last_page": self.is_last_page}
