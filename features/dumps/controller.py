import controllers.types as types_module
import resources.types as resources_module
from controllers.base import CONTROLLERS, Controller
from features.dumps.resource import ITEM, Dump
from resources.base import Refused

TEXT = "text"


class Dumps(Controller):
    resource = Dump

    def create(self, title: str, abstract: str = "", brief: str = "", **data):
        dump = super().create(title, abstract, brief, **data)
        self._collect(dump, [dump.ref])
        return self.load(dump.n)

    def _collect(self, dump, refs: list[str]):
        collections = CONTROLLERS["collection"](self.record, actor=self.actor)
        name = f"Dump {dump.n}, {dump.title}"[:80]
        found = next((row["n"] for row in collections.summaries() if row["title"] == name and not row["deleted"] and not row["completed"]), 0)
        collection = collections.load(found) if found else collections.create(name, abstract=f"Everything dump {dump.n} was filed into")
        collections.add(collection.n, refs)
        if collection.ref not in self.load(dump.n).refs:
            self.link(dump.n, collection.ref)

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
