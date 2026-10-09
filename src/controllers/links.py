from resources.base import Resource
from resources.types import ref_named
from controllers.marks import action
from controllers.stored import listed_order


class Links:
    @action
    def link(self, n: int, ref: str) -> Resource:
        ref = str(ref_named(ref))
        r = self.load(n)
        if ref not in r.refs:
            r.refs.append(ref)
        return self.save(r, "linked", to=ref)

    @action
    def unlink(self, n: int, ref: str) -> Resource:
        ref = str(ref_named(ref))
        r = self.load(n)
        r.refs = [x for x in r.refs if x != ref]
        return self.save(r, "linked", to=ref, off=True)

    @action
    def linked_to(self, ref: str) -> list[Resource]:
        named = sorted(self.rows.linking().get(ref, {}).values(), key=listed_order)
        return [self.load(row["n"]) for row in named if not row["deleted"]]

    def is_linked(self, ref: str) -> bool:
        return bool(self.rows.linking().get(ref))
