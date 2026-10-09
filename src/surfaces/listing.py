import json
from dataclasses import asdict, dataclass
from typing import TypedDict

from controllers.base import LAST
from controllers.types import CONTROLLERS
from resources.fields import Loaded
from features.format import KEEP_SHAPED, VIEWER, settled, shaped, worded
from resources.base import USER, Refused
from overview.counts import counts

LISTED = worded(KEEP_SHAPED)
VIEWED = worded(KEEP_SHAPED)
DASHBOARDS = worded(KEEP_SHAPED)


class Unchanged:
    """A stamp that holds while every list of rows is still the very list it was taken from and the settings are the same."""

    def __init__(self, lists: tuple, settings: tuple):
        self.lists, self.settings = lists, settings

    def __eq__(self, other: object) -> bool:
        return isinstance(other, Unchanged) and self.settings == other.settings and len(self.lists) == len(other.lists) and all(a is b for a, b in zip(self.lists, other.lists))


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


SUMMARY_TEXT = 300


@dataclass(frozen=True)
class Summary:
    """What a row keeps when only its summary is sent: the start of its text and the titles of its sections, marked so the viewer reads the whole row when it opens it."""

    brief: str
    sections: list
    summary: bool = True

    @classmethod
    def of(cls, row: dict) -> "Summary":
        return cls(row["brief"][:SUMMARY_TEXT], [{"title": section.get("title", ""), "body": ""} for section in row["sections"]])


def lightened_row(controller, row: dict) -> dict:
    """A row as the dashboard sends it: the heavy fields their resource declares keep only the named keys, and a resource that sends summaries sends its rows without their text."""
    resource = controller.resource
    keeps = resource.light_in_dashboard
    if not keeps and not resource.summary_in_dashboard:
        return row
    data = {**row["data"], **{field: {key: row["data"][field][key] for key in kept if key in row["data"][field]} for field, kept in keeps.items() if field in row["data"]}}
    return {**row, "data": data, **asdict(Summary.of(row))} if resource.summary_in_dashboard else {**row, "data": data}


ENCODED: dict[tuple, tuple[dict, bytes]] = {}
ENCODED_KEPT = 20000


def encoded(controller, record, view: dict) -> bytes:
    """One row as the JSON it is sent as, made again only when the row's view is a new one, so a type whose rows change one at a time encodes only that row."""
    key = (str(record.home), controller.type, view["n"])
    held = ENCODED.get(key)
    if held and held[0] is view:
        return held[1]
    if len(ENCODED) > ENCODED_KEPT:
        ENCODED.clear()
    body = json.dumps(lightened_row(controller, view)).encode()
    ENCODED[key] = (view, body)
    return body


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


def listed_json(controller, record, listed: ListedRows) -> bytes:
    rows = b", ".join(encoded(controller, record, row) for row in listed["rows"])
    return b'{"rows": [' + rows + b'], "more": ' + (b"true" if listed["more"] else b"false") + b"}"


def held_rows(record, type_: str, query: dict) -> bytes:
    """One type's rows of the dashboard as the JSON they are sent as, made again only when that type's rows or the settings changed, so a type that changes every few seconds rebuilds only itself."""
    controller = CONTROLLERS[type_](record, actor=USER)
    stamp = Unchanged((controller.rows.summaries(),), settled(record))
    return DASHBOARDS.get((str(record.home), type_, tuple(sorted(query.items()))), stamp, lambda: listed_json(controller, record, listing(controller, record, Listing.from_query(query))))


def dashboard(record, wanted: list[str], tallied: list[str], query: dict) -> tuple[bytes, bytes]:
    """The dashboard's lists and counts as the JSON they are sent as, each type's rows held apart."""
    lists = b", ".join(json.dumps(type_).encode() + b": " + held_rows(record, type_, query) for type_ in wanted)
    return b"{" + lists + b"}", json.dumps(counted(record, tallied)).encode()


