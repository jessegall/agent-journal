import time

from features.parts import Command, Context
from features.revisions.history import CHANGE, OPEN_UNTIL, REVISION, count, is_open, read
from resources.base import Refused


class Keep(Command):
    name = "keep"

    def run(self, context: Context, docs, n: int):
        doc = docs.load(n)
        if not is_open(doc):
            raise Refused(f"revision {count(doc)} of doc {doc.n} is already kept")
        return docs.stamp(doc.n, **{OPEN_UNTIL: 0})


class Revisions(Command):
    name = "revisions"

    def run(self, context: Context, docs, n: int) -> list[str]:
        return [listed(read(docs, n, k)) for k in range(1, count(docs.load(n)) + 1)]


class Revision(Command):
    name = "revision"

    def run(self, context: Context, docs, n: int, number: int):
        found = count(docs.load(n))
        if not 1 <= int(number) <= found:
            raise Refused(f"doc {n} has revisions 1 to {found}" if found else f"doc {n} has no revisions yet")
        return read(docs, n, number)


def listed(doc) -> str:
    return f"{doc.data.get(REVISION):>3}  {time.strftime('%Y-%m-%d %H:%M', time.localtime(doc.created))}  {doc.seen[0]:<6} {doc.data.get(CHANGE, '')}"
