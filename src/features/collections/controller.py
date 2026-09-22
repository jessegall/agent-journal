import controllers.types as types_module
import resources.types as resources_module
from controllers.base import CONTROLLERS, Controller
from features.collections.resource import Collection
from resources.base import SYSTEM, Refused


class Collections(Controller):
    resource = Collection

    def create(self, title: str, abstract: str = "", brief: str = "", **data):
        if any(row["title"].lower() == title.strip().lower() for row in self.summaries() if not row["deleted"] and not row["completed"]):
            raise Refused(f"a collection called {title.strip()!r} is already open")
        return super().create(title, abstract, brief, **data)

    def add(self, n: int, refs: list[str]):
        collection = self.load(int(n))
        for ref in refs:
            self._member(ref)
            collection = self.link(collection.n, ref)
        return collection

    def remove(self, n: int, ref: str):
        return self.unlink(int(n), ref)

    def members(self, n: int) -> list[str]:
        found = []
        for ref in self.load(int(n)).refs:
            try:
                row = self._member(ref)
            except Refused:
                continue
            if not row.deleted:
                found.append(f"{row.type} {row.n}  {row.title}")
        return found

    def _member(self, ref: str):
        kind, _, number = ref.partition(":")
        if kind not in CONTROLLERS or not number.isdigit():
            raise Refused(f"{ref!r} is not a row: write it as type:number, like todo:785")
        row = CONTROLLERS[kind](self.record, actor=SYSTEM).load(int(number))
        if row.data.get("system"):
            raise Refused(f"{ref} ships with the journal and cannot be put in a collection")
        return row


resources_module.register(Collection)
types_module.register(Collections)
