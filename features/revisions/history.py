import time

from engine.stored import write_text
from resources.base import PART_OF, SECTION

REVISIONS, OPEN_UNTIL, REVISION, CHANGE = "revisions", "open_until", "revision", "change"


def is_open(doc) -> bool:
    return bool(doc.data.get(REVISIONS)) and time.time() < float(doc.data.get(OPEN_UNTIL) or 0)


def changed(before, after) -> str:
    if before is None:
        return "written"
    top = [f for f in ("title", "abstract", "brief") if getattr(before, f) != getattr(after, f)]
    was, now = {s[SECTION.title]: s[SECTION.body] for s in before.sections}, {s[SECTION.title]: s[SECTION.body] for s in after.sections}
    parts = [f"added {t}" for t in now if t not in was] + [f"rewrote {t}" for t in now if t in was and was[t] != now[t]] + [f"cut {t}" for t in was if t not in now]
    return "; ".join((["reworded the top"] if top else []) + parts)


def noted(text: str, change: str) -> str:
    return "; ".join(dict.fromkeys([*(text.split("; ") if text else []), *([change] if change else [])]))


def revise(docs, head, keep_after: float) -> None:
    numbers = list(head.data.get(REVISIONS) or [])
    last = docs.load(numbers[-1]) if numbers else None
    change = changed(last, head)
    if last is not None and not change:
        return
    with docs.record.locked():
        if last is not None and is_open(head):
            page = last
            page.title, page.abstract, page.brief, page.sections = head.title, head.abstract, head.brief, [dict(s) for s in head.sections]
            page.data[CHANGE] = noted(page.data.get(CHANGE, ""), change)
            page.updated = time.time()
        else:
            k = (docs.numbers() or [0])[-1] + 1
            page = docs.resource(n=k, title=head.title, abstract=head.abstract, brief=head.brief, sections=[dict(s) for s in head.sections],
                                 created=time.time(), updated=time.time(), seen=list(head.seen), refs=[head.ref],
                                 data={PART_OF: head.ref, REVISION: len(numbers) + 1, CHANGE: change})
            numbers.append(k)
        write_text(docs.path(page.n), page.dump())
    docs.stamp(head.n, **{REVISIONS: numbers, OPEN_UNTIL: time.time() + keep_after})
