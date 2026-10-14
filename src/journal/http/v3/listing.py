from dataclasses import dataclass

from journal.http.v3.v3_row import V3Row

PAGE = 25


@dataclass(frozen=True)
class Listing:
    """What version 3's viewer asks of a list: the newest `last` rows, open ones always, closed ones when asked, older than `before`, changed since `since`, or only the numbers named."""

    last: int = PAGE
    completed: bool = False
    closed: bool = False
    before: int = 0
    since: float = 0.0
    only: tuple[int, ...] = ()

    @classmethod
    def from_query(cls, query: dict) -> "Listing":
        flag = lambda key: str(query.get(key, "")).lower() in ("1", "true", "yes")
        only = tuple(int(n) for n in str(query.get("only", "")).split(",") if n.strip().isdigit())
        return cls(int(query.get("last", PAGE) or PAGE), flag("completed"), flag("closed"), int(query.get("before", 0) or 0), float(query.get("since", 0) or 0), only)

    def listed(self, rows: list[V3Row]) -> dict:
        """{rows, more}, rows in order of their number."""
        rows = sorted((r for r in rows if not r.deleted), key=lambda r: r.n)
        if self.only:
            return {"rows": [r.to_json() for r in rows if r.n in self.only], "more": False}
        if self.since:
            return {"rows": [r.to_json() for r in rows if r.updated > self.since], "more": False}
        if self.closed:
            closed = [r for r in rows if r.completed and (not self.before or r.n < self.before)]
            return {"rows": [r.to_json() for r in closed[-self.last:]], "more": len(closed) > self.last}
        wanted = [r for r in rows if (self.completed or not r.completed) and (not self.before or r.n < self.before)]
        page = wanted[-self.last:]
        open_ = [r for r in rows if not r.completed and r not in page] if not self.before else []
        return {"rows": [r.to_json() for r in sorted([*open_, *page], key=lambda r: r.n)], "more": len(wanted) > self.last}
