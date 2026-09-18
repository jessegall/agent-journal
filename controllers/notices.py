from __future__ import annotations

from pathlib import Path

import notices
from controller import Controller, Payload, Result
from payloads import notices as notice_payloads
from payloads.common import ListingPayload


class NoticesController(Controller):
    resource = "notices"
    noun = "notice"
    actions = ("index", "show", "store", "close")
    numbered = ("show", "close")
    payloads = {"index": ListingPayload, "store": notice_payloads.StorePayload}

    def repository(self, root: Path, p: Payload):
        from resources import Notices
        return Notices(root, p.env)

    def index(self, root: Path, p: ListingPayload) -> Result:
        repo = self.repository(root, p)
        query = repo.query() if p.all else repo.query().where(lambda x: not x.closed_at)
        query = self.sorted(query, p)
        if isinstance(query, Result):
            return query
        page = self.paged(query, p)
        return Result("ok", "", [notices.row_response(x.n, x.raw) for x in page.rows],
                      {"left": page.left, "standing": len(notices.standing(root, p.env or None))})

    def show(self, root: Path, p: Payload) -> Result:
        return Result("ok", "", notices.row_response(p.id, self.repository(root, p).find(p.id).raw))

    def store(self, root: Path, p: notice_payloads.StorePayload) -> Result:
        return Result.of(notices.add(root, p.text, p.at, tone=p.tone or "note", link=p.link or "",
                                     label=p.label or "", source=p.source, track=p.env or None), created=True)

    def close(self, root: Path, p: Payload) -> Result:
        return Result.of(notices.close(root, p.id, p.at, by=p.source, track=p.env or None))
