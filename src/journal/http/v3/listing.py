from dataclasses import dataclass

from journal.http.v3.listed_page import ListedPage
from journal.http.v3.v3_row import V3Row

PAGE = 50


@dataclass(frozen=True)
class Listing:
    """What version 3's viewer asks of a list: the newest `last` rows, open ones always unless the list is a timeline, closed ones when asked, newer than `after`, older than `before`, changed since `since`, or only the numbers named."""

    last: int = PAGE
    completed: bool = False
    closed: bool = False
    before: int = 0
    after: int = 0
    """The last number the viewer has seen: a poll carries only the rows above it."""
    since: float = 0.0
    only: tuple[int, ...] = ()
    timeline: bool = False
    """A chat or a feed: the rows page strictly by number, and an open one older than the page waits for a scroll up like any other."""

    @classmethod
    def from_query(cls, query: dict) -> "Listing":
        flag = lambda key: str(query.get(key, "")).lower() in ("1", "true", "yes")
        only = tuple(int(n) for n in str(query.get("n", query.get("only", ""))).split(",") if n.strip().isdigit())
        numbers = {field: kind(query[key]) for key, field, kind in (("last", "last", int), ("before", "before", int), ("from", "after", int), ("since", "since", float)) if query.get(key)}
        return cls(**numbers, completed=flag("completed"), closed=flag("closed"), only=only)

    def listed(self, rows: list[V3Row]) -> ListedPage:
        """{rows, more}, rows in order of their number. A catch-up page since a time keeps deleted rows, so the viewer can drop them."""
        rows = sorted(rows, key=lambda r: r.n)
        if self.only:
            return ListedPage(rows=[r.to_json() for r in rows if r.n in self.only and not r.deleted], more=False)
        if self.since:
            return ListedPage(rows=[r.to_json() for r in rows if r.updated > self.since], more=False)
        rows = [r for r in rows if not r.deleted]
        if self.closed:
            closed = [r for r in rows if r.completed and (not self.before or r.n < self.before)]
            return ListedPage(rows=[r.to_json() for r in closed[-self.last:]], more=len(closed) > self.last)
        wanted = [r for r in rows if (self.completed or not r.completed) and (not self.before or r.n < self.before) and r.n > self.after]
        page = wanted[-self.last:]
        open_ = [r for r in rows if not r.completed and r.n > self.after and r not in page] if not self.before and not self.timeline else []
        return ListedPage(rows=[r.to_json() for r in sorted([*open_, *page], key=lambda r: r.n)], more=len(wanted) > self.last)
