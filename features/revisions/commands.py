import time

from features.parts import Command, Context
from features.revisions.history import CHANGE, OPEN_UNTIL, REVISION, REVISIONS, is_open
from resources.base import SECTION, Refused


class Keep(Command):
    name = "keep"

    def run(self, context: Context, docs, n: int):
        doc = docs.load(int(n))
        if not is_open(doc):
            raise Refused(f"revision {len(doc.data.get(REVISIONS) or [])} of doc {doc.n} is already kept")
        return docs.stamp(doc.n, **{OPEN_UNTIL: 0})


class Revisions(Command):
    name = "revisions"

    def run(self, context: Context, docs, n: int) -> list[str]:
        return [listed(docs.load(k)) for k in docs.load(int(n)).data.get(REVISIONS) or []]


class Revision(Command):
    name = "revision"

    def run(self, context: Context, docs, n: int, number: int):
        found = docs.load(int(n)).data.get(REVISIONS) or []
        if not 1 <= int(number) <= len(found):
            raise Refused(f"doc {n} has revisions 1 to {len(found)}" if found else f"doc {n} has no revisions yet")
        return docs.load(found[int(number) - 1])


class Cut(Command):
    name = "cut"

    def run(self, context: Context, docs, n: int, title: str):
        doc = docs.load(int(n))
        if not any(s[SECTION.title] == title for s in doc.sections):
            raise Refused(f"doc {doc.n} has no part named {title!r}")
        doc.sections = [s for s in doc.sections if s[SECTION.title] != title]
        return docs.save(doc, "updated", section=title)


def listed(doc) -> str:
    return f"{doc.data.get(REVISION):>3}  {time.strftime('%Y-%m-%d %H:%M', time.localtime(doc.created))}  {doc.seen[0]:<6} {doc.data.get(CHANGE, '')}"
