import time

from features.parts import Command, Context
from features.update_reports.gather import SECTIONS, UPDATE, clock, gathered, item, opened_until, since, updates
from resources.base import Refused

SINCE_LAST = "What happened since your last update"
FIRST = "What happened in the last day"


def update_of(reports, n: int):
    r = reports.load(int(n))
    if r.data.get("kind") != UPDATE:
        raise Refused(f"report {r.n} is not an update; journal report recap writes one")
    return r


def rows_of(r) -> list[dict]:
    return [dict(i) for i in r.data.get("items") or []]


def section_of(section: str) -> str:
    if section not in SECTIONS:
        raise Refused(f"an update's sections are {', '.join(SECTIONS)}, not {section!r}")
    return section


class Changes(Command):
    name = "changes"

    def run(self, context: Context, reports) -> list[str]:
        start = since(reports, time.time())
        return [f"since {clock(start)}", *[f"{i['section']} {i['ref']} {i['title']}" + (f" ({i['note']})" if i["note"] else "")
                                            for i in gathered(context.record, start)]]


class Recap(Command):
    name = "recap"

    def run(self, context: Context, reports, summary: str):
        now = time.time()
        start = since(reports, now)
        return reports.create(SINCE_LAST if opened_until(reports) else FIRST, abstract=summary, kind=UPDATE, number=len(updates(reports)) + 1,
                              since=start, until=now, items=gathered(context.record, start))


class Note(Command):
    name = "note"

    def run(self, context: Context, reports, n: int, ref: str, text: str):
        r = update_of(reports, n)
        items = rows_of(r)
        if ref not in {i["ref"] for i in items}:
            raise Refused(f"update report {r.n} has no row {ref}; its rows are {', '.join(i['ref'] for i in items) or 'none'}")
        return reports.stamp(r.n, items=[{**i, "note": text} if i["ref"] == ref else i for i in items])


class Item(Command):
    name = "item"

    def run(self, context: Context, reports, n: int, section: str, ref: str, title: str, note: str = ""):
        r = update_of(reports, n)
        added = item(section_of(section), ref, title, note)
        items = rows_of(r)
        at = max((k + 1 for k, i in enumerate(items) if SECTIONS.index(i["section"]) <= SECTIONS.index(section)), default=0)
        return reports.stamp(r.n, items=[*items[:at], added, *items[at:]])


class Drop(Command):
    name = "drop"

    def run(self, context: Context, reports, n: int, ref: str):
        r = update_of(reports, n)
        items = rows_of(r)
        if ref not in {i["ref"] for i in items}:
            raise Refused(f"update report {r.n} has no row {ref}")
        return reports.stamp(r.n, items=[i for i in items if i["ref"] != ref])
