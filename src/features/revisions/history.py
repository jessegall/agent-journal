import time
from pathlib import Path

from engine.stored import write_text
from resources.base import SECTION

REVISIONS, OPEN_UNTIL, REVISION, CHANGE = "revisions", "open_until", "revision", "change"


def count(doc) -> int:
    return int(doc.data.get(REVISIONS) or 0)


def is_open(doc) -> bool:
    return bool(count(doc)) and time.time() < float(doc.data.get(OPEN_UNTIL) or 0)


def path(docs, n: int, k: int) -> Path:
    return docs.path(int(n)).parent / REVISIONS / f"{int(k):03d}.md"


def read(docs, n: int, k: int):
    found = path(docs, n, k)
    return docs.resource.load(found.read_text()) if found.is_file() else None


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
    k = count(head)
    last = read(docs, head.n, k) if k else None
    change = changed(last, head)
    if last is not None and not change:
        return
    if last is not None and is_open(head):
        page = last
        page.title, page.abstract, page.brief, page.sections = head.title, head.abstract, head.brief, [dict(s) for s in head.sections]
        page.data[CHANGE] = noted(page.data.get(CHANGE, ""), change)
        page.updated = time.time()
    else:
        k += 1
        page = docs.resource(n=head.n, title=head.title, abstract=head.abstract, brief=head.brief, sections=[dict(s) for s in head.sections],
                             created=time.time(), updated=time.time(), seen=list(head.seen), data={REVISION: k, CHANGE: change})
    target = path(docs, head.n, k)
    target.parent.mkdir(parents=True, exist_ok=True)
    write_text(target, page.dump())
    docs.stamp(head.n, **{REVISIONS: k, OPEN_UNTIL: time.time() + keep_after})
