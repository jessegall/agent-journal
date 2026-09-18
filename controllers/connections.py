from __future__ import annotations

from pathlib import Path

from controller import Controller, Payload, Result
from payloads.common import ListingPayload


def _conn():
    import connections
    return connections


def row_response(c) -> dict:
    return {"n": c.n, "name": c.name, "kind": c.kind, "url": c.url, "purpose": c.purpose,
            "secret": c.secret, "secret_set": bool(_conn().secret_state(c.raw).endswith("is set in this shell")),
            "at": c.at, "source": c.source, "overridden": list(c.overridden),
            "project": {k: c.project.get(k, "") for k in _conn().FIELDS}}


class ConnectionsController(Controller):
    resource = "connections"
    noun = "connection"
    actions = ("index", "show")
    numbered = ("show",)
    payloads = {"index": ListingPayload}

    def repository(self, root: Path, p: Payload):
        from resources import Connections
        return Connections(root, p.env or "")

    def identify(self, root: Path, action: str, p: Payload) -> Result | None:
        ref, repo = str(p.id), self.repository(root, p)
        got = repo.find(int(ref)) if ref.isdigit() else next((c for c in repo.all() if c.name == ref), None)
        if got is None:
            return Result("missing", _conn().say("no_such", name=repr(ref)))
        p.id = got.n
        return None

    def index(self, root: Path, p: ListingPayload) -> Result:
        repo = self.repository(root, p)
        query = self.sorted(repo.query(), p)
        if isinstance(query, Result):
            return query
        page = self.paged(query, p)
        return Result("ok", "", [row_response(c) for c in page.rows],
                      {"left": page.left, "total": repo.count()})

    def show(self, root: Path, p: Payload) -> Result:
        return Result("ok", "", row_response(self.repository(root, p).find(p.id)))
