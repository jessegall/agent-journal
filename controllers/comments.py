from __future__ import annotations

from pathlib import Path

import comments
from controller import Controller, Payload, Result
from payloads import comments as comment_payloads


class CommentsController(Controller):
    resource = "comments"
    noun = "comment"
    actions = ("index", "show", "store", "done")
    numbered = ("show", "done")
    payloads = {"index": comment_payloads.ListPayload, "store": comment_payloads.StorePayload,
                "done": comment_payloads.DonePayload}

    def repository(self, root: Path, p: Payload):
        from resources import Comments
        return Comments(root, p.env)

    def index(self, root: Path, p: comment_payloads.ListPayload) -> Result:
        repo = self.repository(root, p)
        query = repo.query()
        if p.about:
            ref, why = comments.parse_ref(p.about)
            if ref is None:
                return Result("refused", why)
            query = query.where(lambda c: c.about == ref)
        if not p.all:
            query = query.where(lambda c: c.open)
        query = self.sorted(query, p)
        if isinstance(query, Result):
            return query
        page = self.paged(query, p)
        return Result("ok", "", [comments.row_response(c.n, c.raw) for c in page.rows],
                      {"left": page.left, "open": len([c for c in repo.all() if c.open])})

    def show(self, root: Path, p: Payload) -> Result:
        return Result("ok", "", comments.row_response(p.id, self.repository(root, p).find(p.id).raw))

    def store(self, root: Path, p: comment_payloads.StorePayload) -> Result:
        return Result.of(comments.add(root, p.about, p.text, p.at, source=p.source, track=p.env or None), created=True)

    def done(self, root: Path, p: comment_payloads.DonePayload) -> Result:
        return Result.of(comments.done(root, p.id, p.how, p.at, track=p.env or None))
