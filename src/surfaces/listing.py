from dataclasses import dataclass
from typing import TypedDict

from controllers.base import LAST
from controllers.types import CONTROLLERS
from resources.fields import Loaded
from features.format import KEEP_SHAPED, VIEWER, settled, shaped, worded
from resources.base import USER, Refused
from overview.counts import counts

LISTED = worded(KEEP_SHAPED)
VIEWED = worded(KEEP_SHAPED)


@dataclass(frozen=True)
class ListingQuery(Loaded):
    n: str = ""
    last: int = LAST
    completed: str = ""
    closed: str = ""
    before: int = 0
    since: float = 0.0
    by: str = ""


@dataclass(frozen=True)
class Listing:
    only: frozenset
    last: int
    completed: bool
    closed: bool
    before: int
    since: float
    by_updated: bool

    @classmethod
    def from_query(cls, query: dict) -> "Listing":
        asked = ListingQuery.from_json(query)
        only = frozenset(int(n) for n in asked.n.split(",") if n)
        return cls(only=only, last=0 if only else asked.last, completed=asked.completed in ("1", "true") or asked.closed in ("1", "true"), closed=asked.closed in ("1", "true"), before=asked.before,
                   since=asked.since, by_updated=asked.by == "updated")


class ListedRows(TypedDict):
    rows: list[dict]
    more: bool


def lightened(controller, listed: ListedRows) -> ListedRows:
    """The dashboard's rows keep only the named keys of the heavy fields their resource declares; the whole row is one request of its own."""
    keeps = controller.resource.light_in_dashboard
    if not keeps:
        return listed

    def light(row: dict) -> dict:
        data = {**row["data"], **{field: {key: row["data"][field][key] for key in kept if key in row["data"][field]} for field, kept in keeps.items() if field in row["data"]}}
        return {**row, "data": data}
    return {**listed, "rows": [light(row) for row in listed["rows"]]}


def listing(controller, record, wanted: Listing) -> ListedRows:
    summaries, stamp = controller.rows.summaries(), settled(record)

    def listed() -> ListedRows:
        return _listed(controller, record, wanted, summaries, stamp)
    if wanted.since:
        return listed()
    return LISTED.get((str(record.home), controller.type, wanted), (summaries, stamp), listed)


def _listed(controller, record, wanted: Listing, summaries: list, stamp: tuple) -> ListedRows:
    since, only, last = wanted.since, wanted.only, wanted.last
    rows = [row for row in summaries if (since or only or not row["deleted"]) and (wanted.completed or not row["completed"]) and (not wanted.closed or row["completed"])
            and (only or controller.resource.hidden_listed or not row.get("hidden"))
            and (not wanted.before or row["n"] < wanted.before) and row["updated"] > since and (not only or row["n"] in only)]
    if wanted.by_updated:
        rows.sort(key=lambda row: row["updated"])
    kept = rows[-last:] if last else rows
    if wanted.completed and last:
        standing = [row for row in rows if not row["completed"]][None if controller.resource.listed_open else -last:]
        kept = sorted({row["n"]: row for row in (*standing, *kept)}.values(), key=lambda row: row["n"])
    return {"rows": [view for row in kept if (view := readable(controller, record, row["n"], row.get("stamp"), stamp))], "more": len(rows) > len(kept)}


def readable(controller, record, n: int, row_stamp, settings: tuple) -> dict | None:
    try:
        return viewed(controller, record, n, row_stamp, settings)
    except Refused:
        return None


def viewed(controller, record, n: int, row_stamp, settings: tuple) -> dict:
    return VIEWED.get((str(record.home), controller.type, n), (row_stamp, settings), lambda: shaped(controller.load(n), record, VIEWER))


def counted(record, types) -> dict:
    return {type_: counts(CONTROLLERS[type_](record, actor=USER)) for type_ in types}


