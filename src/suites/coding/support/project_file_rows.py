from collections.abc import Mapping, Sequence
from dataclasses import dataclass


@dataclass(frozen=True)
class ProjectFileRows:
    """Files and folders of an environment's checkout, as rows a window draws."""

    rows: Sequence[Mapping[str, object]]

    def json(self) -> Mapping[str, object]:
        return {"rows": list(self.rows)}
