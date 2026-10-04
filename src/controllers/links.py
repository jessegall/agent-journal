from resources.base import Resource


class Links:
    def link(self, n: int, ref: str) -> Resource:
        r = self.load(n)
        if ref not in r.refs:
            r.refs.append(ref)
        return self.save(r, "linked", to=ref)

    def unlink(self, n: int, ref: str) -> Resource:
        r = self.load(n)
        r.refs = [x for x in r.refs if x != ref]
        return self.save(r, "linked", to=ref, off=True)

    def linked_to(self, ref: str) -> list[Resource]:
        return [self.load(row["n"]) for row in self.summaries() if ref in row["refs"] and not row["deleted"]]
