from controllers.base import Controller
from resources import types


class Docs(Controller):
    resource = types.Doc

    def draft(self, n: int):
        return self.update(n, status="draft")

    def complete(self, n: int, how: str = "", **data):
        self.update(n, status="final")
        return super().complete(n, how or "final", **data)

    def supersede(self, n: int, by: int):
        newer = self.load(int(by))
        self.complete(n, how=f"superseded by doc {newer.n}")
        self.link(n, newer.ref)
        return self.link(newer.n, self.load(n).ref)
