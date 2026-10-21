from dataclasses import dataclass
from datetime import datetime
from typing import Callable

from journal.http.listed_page import ListedPage
from journal.models.model import Model

PAGE = 50


@dataclass(frozen=True)
class Listing:
    """What the viewer asks of a list: the newest `limit` rows and every open one besides, the closed ones alone when asked, older than `before`, newer than `after`, changed since `since`, or only the ids named."""

    limit: int = PAGE
    closed: bool = False
    before: int = 0
    after: int = 0
    since: float = 0.0
    ids: tuple[int, ...] = ()

    @classmethod
    def from_query(cls, query: dict) -> "Listing":
        ids = tuple(int(n) for n in str(query.get("ids", "")).split(",") if n.strip().isdigit())
        numbers = {name: kind(query[name]) for name, kind in (("limit", int), ("before", int), ("after", int), ("since", float)) if query.get(name)}
        return cls(**numbers, closed=str(query.get("closed", "")).lower() in ("1", "true", "yes"), ids=ids)

    def listed(self, rows: list[Model], is_open: Callable[[Model], bool], timeline: bool = False) -> ListedPage:
        rows = sorted(rows, key=lambda r: r.id)
        if self.ids:
            return ListedPage(rows=[r for r in rows if r.id in self.ids], more=False)
        if self.since:
            return ListedPage(rows=[r for r in rows if self.seconds(r.updated_at) > self.since], more=False)
        if self.closed:
            closed = [r for r in rows if not is_open(r) and (not self.before or r.id < self.before)]
            return ListedPage(rows=closed[-self.limit:], more=len(closed) > self.limit)
        wanted = [r for r in rows if (not self.before or r.id < self.before) and r.id > self.after]
        page = wanted[-self.limit:]
        shown = {r.id for r in page}
        open_ = [r for r in rows if is_open(r) and r.id > self.after and r.id not in shown] if not self.before and not timeline else []
        return ListedPage(rows=sorted([*open_, *page], key=lambda r: r.id), more=len(wanted) > self.limit)

    @staticmethod
    def seconds(time: datetime | None) -> float:
        return time.timestamp() if time else 0.0
