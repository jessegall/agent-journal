from dataclasses import dataclass
from datetime import datetime
from typing import Callable

from journal.http.row_list_page import RowListPage
from journal.models.model import Model

PAGE_ROWS = 50


@dataclass(frozen=True)
class Listing:
    """What the viewer asks of a list: the newest `limit` rows and every open one besides, the closed ones alone when asked, older than `before`, newer than `after`, changed since `since`, or only the ids named."""

    limit: int = PAGE_ROWS
    closed: bool = False
    upper_id: int = 0
    lower_id: int = 0
    cutoff_at: float = 0.0
    ids: tuple[int, ...] = ()

    @classmethod
    def query_listing(cls, query: dict) -> "Listing":
        ids = tuple(int(n) for n in str(query.get("ids", "")).split(",") if n.strip().isdigit())
        numbers = {field: kind(query[key]) for key, field, kind in (("limit", "limit", int), ("before", "upper_id", int), ("after", "lower_id", int), ("since", "cutoff_at", float)) if query.get(key)}
        return cls(**numbers, closed=str(query.get("closed", "")).lower() in ("1", "true", "yes"), ids=ids)

    def listed(self, rows: list[Model], is_open: Callable[[Model], bool], timeline: bool = False) -> RowListPage:
        rows = sorted(rows, key=lambda r: r.id)
        if self.ids:
            return RowListPage(rows=[r for r in rows if r.id in self.ids], is_last_page=True)
        if self.cutoff_at:
            return RowListPage(rows=[r for r in rows if self.seconds(r.updated_at) > self.cutoff_at], is_last_page=True)
        if self.closed:
            closed = [r for r in rows if not is_open(r) and (not self.upper_id or r.id < self.upper_id)]
            return RowListPage(rows=closed[-self.limit:], is_last_page=len(closed) <= self.limit)
        wanted = [r for r in rows if (not self.upper_id or r.id < self.upper_id) and r.id > self.lower_id]
        page = wanted[-self.limit:]
        shown = {r.id for r in page}
        open_ = [r for r in rows if is_open(r) and r.id > self.lower_id and r.id not in shown] if not self.upper_id and not timeline else []
        return RowListPage(rows=sorted([*open_, *page], key=lambda r: r.id), is_last_page=len(wanted) <= self.limit)

    @staticmethod
    def seconds(time: datetime | None) -> float:
        return time.timestamp() if time else 0.0
