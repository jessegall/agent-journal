from collections.abc import Mapping, Sequence
from dataclasses import dataclass


@dataclass(frozen=True)
class GitPullRows:
    """The open pull requests, and whether the gh program could read them."""

    available: bool
    rows: Sequence[Mapping[str, object]]

    def json(self) -> Mapping[str, object]:
        return {"available": self.available, "rows": list(self.rows)}
