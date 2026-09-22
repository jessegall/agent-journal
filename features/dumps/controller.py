import controllers.types as types_module
import resources.types as resources_module
from controllers.base import CONTROLLERS, Controller
import time

from features.dumps.resource import ENTRY, ITEM, Dump
from resources.base import Refused

TEXT = "text"
LOG_KEPT = 20


class Dumps(Controller):
    resource = Dump

    def create(self, title: str, abstract: str = "", brief: str = "", **data):
        dump = super().create(title, abstract, brief, **data)
        self._collect(dump, [dump.ref])
        return self.load(dump.n)

    def _collections(self):
        return CONTROLLERS["collection"](self.record, actor=self.actor)

    def _collection(self, dump) -> int:
        return next((int(ref.split(":")[1]) for ref in dump.refs if ref.startswith("collection:")), 0)

    def _collect(self, dump, refs: list[str]):
        collections = self._collections()
        found = self._collection(dump)
        collection = collections.load(found) if found else collections.create(f"Dump {dump.n}, {dump.title}"[:80], abstract=f"Everything dump {dump.n} was filed into")
        collections.add(collection.n, refs)
        if not found:
            self.link(dump.n, collection.ref)

    def name(self, n: int, title: str):
        found = self._collection(self.load(int(n)))
        if not found:
            raise Refused(f"dump {n} has no collection")
        return self._collections().update(found, title=title.strip())

    def _names(self, r) -> list[str]:
        return ([TEXT] if r.brief.strip() else []) + sorted(r.files)

    def _item(self, r, item: str) -> dict:
        if item not in self._names(r):
            raise Refused(f"dump {r.n} has no item {item!r}; its items are {', '.join(self._names(r)) or 'none yet'}")
        return dict((r.data.get("items") or {}).get(item) or {})

    def _write(self, n: int, item: str, **values):
        r = self.load(int(n))
        items = {**(r.data.get("items") or {}), item: {**self._item(r, item), **values}}
        written = self.update(r.n, items=items)
        settled = [items.get(name, {}) for name in self._names(written)]
        if not written.completed and settled and all(i.get(ITEM.outcome) or i.get(ITEM.failed) for i in settled):
            failed = sum(bool(i.get(ITEM.failed)) for i in settled)
            return self.complete(r.n, how=f"{len(settled) - failed} filed" + (f", {failed} failed" if failed else ""))
        return written

    def note(self, n: int, item: str, insight: str):
        return self._write(n, item, **{ITEM.insight: insight.strip()})

    def filed(self, n: int, item: str, how: str, refs: str = ""):
        if not how.strip():
            raise Refused("say what was done with it")
        found = [ref.strip() for ref in refs.split(",") if ref.strip()]
        for ref in found:
            self.link(int(n), ref)
        if found:
            self._collect(self.load(int(n)), found)
        return self._write(n, item, **{ITEM.outcome: how.strip(), ITEM.refs: found, ITEM.failed: ""})

    def failed(self, n: int, item: str, why: str):
        if not why.strip():
            raise Refused("say why it could not be filed")
        return self._write(n, item, **{ITEM.failed: why.strip()})

    def log(self, n: int, status: str, on: str = ""):
        r = self.load(int(n))
        if not status.strip():
            raise Refused("say what you are doing")
        if r.completed:
            raise Refused(f"dump {r.n} is closed")
        entries = [*(r.data.get("log") or []), {ENTRY.at: time.time(), ENTRY.text: status.strip(), ENTRY.on: on.strip()}]
        return self.update(r.n, log=entries[-LOG_KEPT:])

    def _in_hand(self):
        return min(self._standing(), key=lambda r: r.n, default=None)

    def items(self, n: int) -> list[str]:
        r = self.load(int(n))
        return [f"{name}: {standing(self._item(r, name))}" for name in self._names(r)]


def standing(item: dict) -> str:
    if item.get(ITEM.failed):
        return f"failed - {item[ITEM.failed]}"
    if item.get(ITEM.outcome):
        return f"filed - {item[ITEM.outcome]}"
    return f"noted - {item[ITEM.insight]}" if item.get(ITEM.insight) else "not read yet"


resources_module.register(Dump)
types_module.register(Dumps)
