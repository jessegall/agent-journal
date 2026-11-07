from collections.abc import Mapping, Sequence
from typing import TypedDict


class WorkerStatusPageJson(TypedDict):
    rows: Sequence[Mapping[str, object]]
    page: int
    size: int
    total: int
