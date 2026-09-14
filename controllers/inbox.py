from __future__ import annotations

from pathlib import Path

import fmt
import inbox
from controller import Controller, Payload, Result
from payloads.common import ListingPayload, MovePayload, TextPayload, WhyPayload
from payloads.inbox import AttachPayload, DetachPayload, FilePayload, ProcessPayload, StorePayload, ReplyPayload


class InboxController(Controller):
    resource = "inbox"
    noun = "message"
    actions = ("index", "show", "store", "update", "process", "file", "detach", "attach", "done", "move", "destroy", "reply", "waiting")
    numbered = ("show", "update", "process", "file", "detach", "attach", "done", "move", "destroy", "reply")
    payloads = {"index": ListingPayload, "store": StorePayload, "update": TextPayload, "process": ProcessPayload,
                "file": FilePayload, "detach": DetachPayload, "attach": AttachPayload, "move": MovePayload,
                "destroy": WhyPayload, "reply": ReplyPayload}
    # a processed or moved message is the record of what it became
    EDITS = frozenset({"update", "process", "file", "done", "move"})

    def repository(self, root: Path, p: Payload):
        from resources import Messages
        return Messages(root, p.env)

    def guard(self, root: Path, action: str, p: Payload) -> Result | None:
        if action == "destroy" and self.repository(root, p).find(p.id).archived:
            return Result("refused", inbox.say("already_archived", n=p.id))
        if action in self.EDITS and not self.repository(root, p).find(p.id).waiting:
            return Result("refused", inbox.say("already_processed", n=p.id))
        return None

    def _row(self, root: Path, p: Payload, n: int) -> dict:
        return inbox.row_response(n, self.repository(root, p).find(n).raw)

    def index(self, root: Path, p: ListingPayload) -> Result:
        repo = self.repository(root, p)
        every = repo.all()
        base = repo.query() if p.all else repo.query().where(lambda m: not m.archived)
        if p.sort:
            query = self.sorted(base, p)
            if isinstance(query, Result):
                return query
        else:
            # waiting ones first, each newest first unless asked otherwise
            query = base.order_by("n", p.order or fmt.DESC).order_by("status_order")
        page = self.paged(query, p)
        waiting = len([m for m in every if m.waiting])
        return Result("ok", "", [inbox.row_response(m.n, m.raw) for m in page.rows],
                      {"left": page.left, "waiting": waiting, "processed": len([m for m in every if not m.waiting and not m.archived]),
                       "archived": len([m for m in every if m.archived])})

    @staticmethod
    def _read(root: Path, p: Payload, numbers: list[int]) -> None:
        """The agent reading a message is what the viewer shows as it being handled; the user opening it is not."""
        if p.source != "web" and numbers:
            from datetime import datetime, timezone
            inbox.mark_read(root, numbers, p.at or datetime.now(timezone.utc).isoformat(timespec="seconds"), p.env or None)

    def show(self, root: Path, p: Payload) -> Result:
        self._read(root, p, [p.id])
        return Result("ok", "", inbox.detail(root, p.id, self.repository(root, p).find(p.id).raw, p.env or None))

    def waiting(self, root: Path, p: Payload) -> Result:
        """Every message still waiting to be processed, oldest first, each in full."""
        self._read(root, p, [m.n for m in self.repository(root, p).query() if m.waiting])
        rows = [m for m in self.repository(root, p).query().order_by("n", fmt.ASC) if m.waiting]
        return Result("ok", "", [inbox.detail(root, m.n, m.raw, p.env or None) for m in rows])

    def store(self, root: Path, p: StorePayload) -> Result:
        files = p.files if isinstance(p.files, list) else []
        outcome = inbox.add(root, p.text, p.at, source=p.source, track=p.env or None, files=files)
        data = self._row(root, p, self.repository(root, p).count()) if outcome[0] else None
        return Result.of(outcome, data, created=True)

    def update(self, root: Path, p: TextPayload) -> Result:
        return Result.of(inbox.update(root, p.id, p.text, p.env or None), self._row(root, p, p.id))

    def process(self, root: Path, p: ProcessPayload) -> Result:
        return Result.of(inbox.process(root, p.id, p.part, p.became, p.at, p.env or None), self._row(root, p, p.id))

    def file(self, root: Path, p: FilePayload) -> Result:
        return Result.of(inbox.file_into(root, p.id, p.name, p.into, p.at, p.env or None), self._row(root, p, p.id))

    def detach(self, root: Path, p: DetachPayload) -> Result:
        return Result.of(inbox.detach(root, p.id, p.name, p.why, p.at, p.env or None), self._row(root, p, p.id))

    def attach(self, root: Path, p: AttachPayload) -> Result:
        return Result.of(inbox.attach(root, p.id, p.files, p.at, p.source, p.env or None), self._row(root, p, p.id))

    def destroy(self, root: Path, p: WhyPayload) -> Result:
        return Result.of(inbox.archive(root, p.id, p.why, p.at, p.env or None), self._row(root, p, p.id))

    def reply(self, root: Path, p: ReplyPayload) -> Result:
        # a reply is allowed on any message, processed or not, so it is not one of the EDITS
        return Result.of(inbox.reply(root, p.id, p.text, p.at, source=p.source, track=p.env or None,
                                     part=p.part if p.has("part") else ""), self._row(root, p, p.id))

    def done(self, root: Path, p: Payload) -> Result:
        return Result.of(inbox.done(root, p.id, p.at, p.env or None), self._row(root, p, p.id))

    def move(self, root: Path, p: MovePayload) -> Result:
        return Result.of(inbox.move(root, p.id, p.environment, p.at, p.env or None), self._row(root, p, p.id))
