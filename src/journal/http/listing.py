from dataclasses import dataclass
from typing import Callable, TypeVar

from journal.http.row_list_page import RowListPage
from journal.models.model import Model

PAGE_ROWS = 50

M = TypeVar("M", bound=Model)


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
        cutoff = float(query["since"]) if query.get("since") else 0.0
        closed = str(query.get("closed", "")).lower() in ("1", "true", "yes")
        return cls(cls.query_number(query, "limit", PAGE_ROWS), closed, cls.query_number(query, "before", 0), cls.query_number(query, "after", 0), cutoff, ids)

    @staticmethod
    def query_number(query: dict, key: str, default: int) -> int:
        return int(query[key]) if query.get(key) else default

    def listed(self, rows: list[M], is_open: Callable[[M], bool], timeline: bool = False) -> RowListPage:
        rows = sorted(rows, key=lambda r: r.row_id)
        if self.ids:
            return RowListPage(rows=[r for r in rows if r.row_id in self.ids], is_last_page=True)
        if self.cutoff_at:
            return RowListPage(rows=[r for r in rows if r.update_time.timestamp() > self.cutoff_at], is_last_page=True)
        if self.closed:
            closed = [r for r in rows if not is_open(r) and (not self.upper_id or r.row_id < self.upper_id)]
            return RowListPage(rows=closed[-self.limit:], is_last_page=len(closed) <= self.limit)
        wanted = [r for r in rows if (not self.upper_id or r.row_id < self.upper_id) and r.row_id > self.lower_id]
        page = wanted[-self.limit:]
        shown = {r.row_id for r in page}
        open_ = [r for r in rows if is_open(r) and r.row_id > self.lower_id and r.row_id not in shown] if not self.upper_id and not timeline else []
        return RowListPage(rows=sorted([*open_, *page], key=lambda r: r.row_id), is_last_page=len(wanted) <= self.limit)
