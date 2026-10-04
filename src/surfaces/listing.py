from dataclasses import dataclass
from typing import TypedDict

from controllers.base import LAST
from controllers.types import CONTROLLERS
from engine.fields import Loaded
from features.format import KEEP_SHAPED, VIEWER, settled, shaped
from resources.base import USER, Refused

LISTED: dict[tuple, tuple] = {}
VIEWED: dict[tuple, tuple] = {}
TALLIED: dict[tuple, tuple] = {}


@dataclass(frozen=True)
class ListingQuery(Loaded):
    n: str = ""
    last: int = LAST
    completed: str = ""
    before: int = 0
    since: float = 0.0
    by: str = ""


@dataclass(frozen=True)
class Listing:
    only: frozenset
    last: int
    completed: bool
    before: int
    since: float
    by_updated: bool

    @classmethod
    def from_query(cls, query: dict) -> "Listing":
        asked = ListingQuery.from_json(query)
        only = frozenset(int(n) for n in asked.n.split(",") if n)
        return cls(only=only, last=0 if only else asked.last, completed=asked.completed in ("1", "true"), before=asked.before,
                   since=asked.since, by_updated=asked.by == "updated")


class ListedRows(TypedDict):
    rows: list[dict]
    more: bool


def listing(controller, record, wanted: Listing) -> ListedRows:
    summaries, stamp = controller.summaries(), settled(record)
    key = (str(record.home), controller.type, wanted)
    held = LISTED.get(key)
    if held and held[0] is summaries and held[1] == stamp:
        return held[2]
    listed = _listed(controller, record, wanted, summaries, stamp)
    if not wanted.since:
        if len(LISTED) >= KEEP_SHAPED:
            LISTED.clear()
        LISTED[key] = (summaries, stamp, listed)
    return listed


def _listed(controller, record, wanted: Listing, summaries: list, stamp: tuple) -> ListedRows:
    since, only, last = wanted.since, wanted.only, wanted.last
    rows = [row for row in summaries if (since or only or not row["deleted"]) and (wanted.completed or not row["completed"])
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
    key = (str(record.home), controller.type, n)
    stamp = (row_stamp, settings)
    held = VIEWED.get(key)
    if not row_stamp or not held or held[0] != stamp:
        if len(VIEWED) >= KEEP_SHAPED:
            VIEWED.clear()
        held = VIEWED[key] = (stamp, shaped(controller.load(n), record, VIEWER))
    return held[1]


def counted(record, types) -> dict:
    return {type_: counts(CONTROLLERS[type_](record, actor=USER)) for type_ in types}


def counts(controller) -> dict:
    summaries = controller.summaries()
    key = (str(controller.record.home), controller.type)
    held = TALLIED.get(key)
    if held and held[0] is summaries:
        return held[1]
    tally = {"all": 0, "open": 0, "unread": 0}
    for row in summaries:
        if row["deleted"] or row.get("hidden"):
            continue
        tally["all"] += 1
        if not row["completed"]:
            tally["open"] += 1
            tally["unread"] += USER not in (row.get("seen") or [])
    TALLIED[key] = (summaries, tally)
    return tally
