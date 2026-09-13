from __future__ import annotations

from pathlib import Path

import fmt
import inbox
from controller import Controller, Payload, Result
from payloads.common import ListingPayload, MovePayload, TextPayload
from payloads.inbox import ProcessPayload


class InboxController(Controller):
    resource = "inbox"
    noun = "message"
    actions = ("index", "show", "store", "update", "process", "done", "move")
    numbered = ("show", "update", "process", "done", "move")
    payloads = {"index": ListingPayload, "store": TextPayload, "update": TextPayload, "process": ProcessPayload,
                "move": MovePayload}
    # a processed or moved message is the record of what it became
    EDITS = frozenset({"update", "process", "done", "move"})

    def repository(self, root: Path, p: Payload):
        from resources import Messages
        return Messages(root, p.env)

    def guard(self, root: Path, action: str, p: Payload) -> Result | None:
        if action in self.EDITS and not self.repository(root, p).find(p.id).waiting:
            return Result("refused", inbox.say("already_processed", n=p.id))
        return None

    def _row(self, root: Path, p: Payload, n: int) -> dict:
        return inbox.row_response(n, self.repository(root, p).find(n).raw)

    def index(self, root: Path, p: ListingPayload) -> Result:
        repo = self.repository(root, p)
        every = repo.all()
        if p.sort:
            query = self.sorted(repo.query(), p)
            if isinstance(query, Result):
                return query
        else:
            # waiting ones first, each newest first unless asked otherwise
            query = repo.query().order_by("n", p.order or fmt.DESC).order_by("status_order")
        page = self.paged(query, p)
        waiting = len([m for m in every if m.waiting])
        return Result("ok", "", [inbox.row_response(m.n, m.raw) for m in page.rows],
                      {"left": page.left, "waiting": waiting, "processed": len(every) - waiting})

    def show(self, root: Path, p: Payload) -> Result:
        return Result("ok", "", inbox.detail(root, p.id, self.repository(root, p).find(p.id).raw, p.env or None))

    def store(self, root: Path, p: TextPayload) -> Result:
        outcome = inbox.add(root, p.text, p.at, source=p.source, track=p.env or None)
        data = self._row(root, p, self.repository(root, p).count()) if outcome[0] else None
        return Result.of(outcome, data, created=True)

    def update(self, root: Path, p: TextPayload) -> Result:
        return Result.of(inbox.update(root, p.id, p.text, p.env or None), self._row(root, p, p.id))

    def process(self, root: Path, p: ProcessPayload) -> Result:
        return Result.of(inbox.process(root, p.id, p.part, p.became, p.at, p.env or None), self._row(root, p, p.id))

    def done(self, root: Path, p: Payload) -> Result:
        return Result.of(inbox.done(root, p.id, p.at, p.env or None), self._row(root, p, p.id))

    def move(self, root: Path, p: MovePayload) -> Result:
        return Result.of(inbox.move(root, p.id, p.environment, p.at, p.env or None), self._row(root, p, p.id))
