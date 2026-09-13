from __future__ import annotations

from pathlib import Path

import state
from controller import Controller, Payload, Result
from payloads.common import ListingPayload, WhyPayload
from payloads.tools import StorePayload, UpdatePayload
from templates import render

MESSAGES = {
    "nothing_to_change": "send a title, a summary, a usage, a when or an entry to change",
}


def say(message: str, /, **values) -> str:
    return render(MESSAGES[message], **values)


def _tools():
    import tools
    return tools


class ToolsController(Controller):
    resource = "tools"
    noun = "tool"
    scoped = False
    actions = ("index", "show", "store", "update", "destroy", "adopt")
    numbered = ("show", "update", "destroy")
    payloads = {"index": ListingPayload, "store": StorePayload, "update": UpdatePayload, "destroy": WhyPayload}
    FIELDS = ("title", "summary", "usage", "when", "entry")

    def repository(self, root: Path, p: Payload):
        from resources import ToolCatalogue
        return ToolCatalogue(root)

    def identify(self, root: Path, action: str, p: Payload) -> Result | None:
        # a tool is named by its number in the catalogue, or by its name
        ref, repo = str(p.id), self.repository(root, p)
        tool = repo.find(int(ref)) if ref.isdigit() else next((t for t in repo.all() if t.name == ref), None)
        if tool is None:
            return Result("missing", _tools().say("no_such", name=repr(ref)))
        p.id = tool.n
        return None

    def index(self, root: Path, p: ListingPayload) -> Result:
        tools, repo = _tools(), self.repository(root, p)
        query = self.sorted(repo.query(), p)
        if isinstance(query, Result):
            return query
        page = self.paged(query, p)
        return Result("ok", "", [tools.row(t.n, t.raw) for t in page.rows],
                      {"left": page.left, "total": repo.count(), "loose": [x.name for x in tools.uncatalogued(root)]})

    def show(self, root: Path, p: Payload) -> Result:
        tool = self.repository(root, p).find(p.id)
        return Result("ok", "", _tools().detail(root, tool.n, tool.raw))

    def store(self, root: Path, p: StorePayload) -> Result:
        return Result.of(_tools().add(root, p.name, p.title, p.summary, p.usage, p.when, p.entry, p.body,
                                      p.env or state.current_track(root)), created=True)

    def update(self, root: Path, p: UpdatePayload) -> Result:
        name, said = self.repository(root, p).find(p.id).name, []
        for field in self.FIELDS:
            if p.has(field):
                ok, message = _tools().set_field(root, name, field, getattr(p, field))
                if not ok:
                    return Result("refused", message)
                said.append(message)
        if not said:
            return Result("refused", say("nothing_to_change"))
        return Result("ok", "\n".join(said))

    def destroy(self, root: Path, p: WhyPayload) -> Result:
        return Result.of(_tools().remove(root, self.repository(root, p).find(p.id).name, p.why))

    def adopt(self, root: Path, p: Payload) -> Result:
        return Result("ok", "\n".join(_tools().adopt(root, p.env or state.current_track(root))))
