from __future__ import annotations

from pathlib import Path

from controller import Controller, Payload, Result
from payloads.common import ListingPayload, WhyPayload
from payloads.style import StorePayload, UpdatePayload
from templates import render

MESSAGES = {
    "nothing_to_change": "send a title, a decision or a when to change",
}


def say(message: str, /, **values) -> str:
    return render(MESSAGES[message], **values)


def _style():
    import style
    return style


class StyleController(Controller):
    """The project's coding style rules; every change regenerates their skills."""
    resource = "style"
    noun = "rule"
    scoped = False
    actions = ("index", "show", "store", "update", "destroy", "sync")
    numbered = ("show", "update", "destroy")
    payloads = {"index": ListingPayload, "store": StorePayload, "update": UpdatePayload, "destroy": WhyPayload, "sync": Payload}
    FIELDS = ("title", "decision", "when")

    def repository(self, root: Path, p: Payload):
        from resources import StyleBook
        return StyleBook(root)

    def identify(self, root: Path, action: str, p: Payload) -> Result | None:
        # a rule is named by its number or by its subject
        ref, repo = str(p.id), self.repository(root, p)
        item = repo.find(int(ref)) if ref.isdigit() else next((i for i in repo.all() if i.subject == ref), None)
        if item is None:
            return Result("missing", _style().say("no_such", name=repr(ref)))
        p.id = item.n
        return None

    def _synced(self, root: Path, outcome: tuple[bool, str]) -> tuple[bool, str]:
        if not outcome[0]:
            return outcome
        return True, outcome[1] + "\n" + "\n".join(_style().sync(root, root.parent))

    def index(self, root: Path, p: ListingPayload) -> Result:
        style, repo = _style(), self.repository(root, p)
        query = self.sorted(repo.query(), p)
        if isinstance(query, Result):
            return query
        page = self.paged(query, p)
        return Result("ok", "", [style.row(i.n, i.raw) for i in page.rows], {"left": page.left, "total": repo.count()})

    def show(self, root: Path, p: Payload) -> Result:
        item = self.repository(root, p).find(p.id)
        return Result("ok", "", _style().detail(root, item.n, item.raw))

    def store(self, root: Path, p: StorePayload) -> Result:
        return Result.of(self._synced(root, _style().add(root, p.subject, p.title, p.decision, p.when, p.body)), created=True)

    def update(self, root: Path, p: UpdatePayload) -> Result:
        subject, said = self.repository(root, p).find(p.id).subject, []
        for field in self.FIELDS:
            if p.has(field):
                ok, message = _style().set_field(root, subject, field, getattr(p, field))
                if not ok:
                    return Result("refused", message)
                said.append(message)
        if not said:
            return Result("refused", say("nothing_to_change"))
        return Result.of(self._synced(root, (True, "\n".join(said))))

    def destroy(self, root: Path, p: WhyPayload) -> Result:
        return Result.of(self._synced(root, _style().remove(root, self.repository(root, p).find(p.id).subject, p.why)))

    def sync(self, root: Path, p: Payload) -> Result:
        return Result("ok", "\n".join(_style().sync(root, root.parent)))
