import controllers.types as types_module
import resources.types as resources_module
from controllers.base import Controller, row_of
from features.collections.resource import Collection
from resources.base import Refused
from controllers.marks import action


class Collections(Controller):
    resource = Collection

    @action
    def create(self, title: str, abstract: str = "", brief: str = "", **data):
        if any(row["title"].lower() == title.strip().lower() for row in self.rows.summaries() if not row["deleted"] and not row["completed"]):
            raise Refused(f"a collection called {title.strip()!r} is already open")
        return super().create(title, abstract, brief, **data)

    @action
    def add(self, n: int, refs: list[str]):
        collection = self.load(n)
        for named in refs:
            ref = str(resources_module.ref_named(named))
            self._member(ref)
            collection = self.link(collection.n, ref)
        return collection

    @action
    def remove(self, n: int, ref: str):
        return self.unlink(int(n), ref)

    @action
    def members(self, n: int) -> list[str]:
        found = []
        collection = self.load(n)
        for ref in collection.refs:
            if ref == collection.source:
                continue
            try:
                row = self._member(ref)
            except Refused:
                continue
            if not row.deleted:
                found.append(f"{row.type} {row.n}  {row.title}")
        return found

    def _member(self, ref: str):
        row = row_of(self.record, ref)
        if row.data.get("system"):
            raise Refused(f"{ref} ships with the journal and cannot be put in a collection")
        return row


resources_module.register(Collection)
types_module.register(Collections)
