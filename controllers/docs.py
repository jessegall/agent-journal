from __future__ import annotations

from pathlib import Path

import state
from controller import Controller, Payload, Result
from templates import render

MESSAGES = {
    "move_both": "`docs move {doc}` was given both `--global` and `{dst}`. A doc belongs to the project or to one "
                 "environment; say which.",
    "move_where": '`journal docs move <doc> "<environment>"` — or `--global` to give it to the project, which lists '
                  "it on every environment",
    "nothing_to_change": "send an abstract, a status or a body to change",
    "attach_here": "attaching copies a file from this machine, so it is done from the terminal: journal docs attach",
    "search_wants": "docs search wants a term",
}


def say(message: str, /, **values) -> str:
    return render(MESSAGES[message], **values)


def _docs():
    import docs
    return docs


class DocsController(Controller):
    resource = "docs"
    noun = "doc"
    scoped = None
    actions = ("index", "show", "store", "update", "destroy", "part", "final", "draft", "move", "supersede",
               "attach", "detach", "files", "adopt", "search")
    numbered = ("show", "update", "destroy", "part", "final", "draft", "move", "supersede", "attach", "detach")

    def repository(self, root: Path, p: Payload):
        from resources import Docs
        return Docs(root)

    def identify(self, root: Path, action: str, p: Payload) -> Result | None:
        # a doc is named by number, by part (4.2) or by title
        ref = str(p.id)
        doc, prt, err = _docs().get(root, ref)
        if doc is None or (prt is None and "." in ref):
            return Result("missing", err)
        p.id = f"{doc['n']}.{prt['p']}" if prt else str(doc["n"])
        return None

    @staticmethod
    def _author(root: Path, p: Payload) -> str:
        return p.env or state.current_track(root)

    def index(self, root: Path, p: Payload) -> Result:
        docs = _docs()
        every = docs._load(root)
        if p.get("all"):
            shelf = every
        elif p.text("scope") == "here":
            shelf = [d for d in every if docs.here(d, p.env)]
        else:
            shelf = [d for d in every if docs.scope_of(d) == (p.env or docs.GLOBAL)]
        wanted = {d["n"] for d in shelf}
        query = self.sorted(self.repository(root, p).query().where(lambda d: d.n in wanted), p)
        if isinstance(query, Result):
            return query
        page = self.paged(query, p)
        return Result("ok", "", [{**docs.row(root, d.raw), "facts": docs.facts_text(root, d.raw)} for d in page.rows],
                      {"left": page.left, "shelf": len(shelf), "elsewhere": len(every) - len(shelf),
                       "drafts": len([d for d in shelf if d.get("status") != "final"]),
                       "loose": [x.name for x in docs.uncatalogued(root)], "folder": docs.folder(root).name})

    def show(self, root: Path, p: Payload) -> Result:
        import views
        docs = _docs()
        doc, prt, _ = docs.get(root, p.id)
        n = doc["n"]
        return Result("ok", "", {**docs.detail(root, doc, prt), "questions": views.questions_everywhere(
            root, lambda ref: ref == f"doc:{n}" or ref.startswith(f"doc:{n}."))})

    def store(self, root: Path, p: Payload) -> Result:
        docs = _docs()
        scope = docs.GLOBAL if p.get("global") or not p.env else p.env
        outcome = docs.add(root, p.text("title"), p.text("abstract"), str(p.get("body") or ""), scope)
        return Result.of(outcome, created=True)

    def update(self, root: Path, p: Payload) -> Result:
        docs, said = _docs(), []
        changes = (("abstract", lambda: docs.set_abstract(root, p.id, p.text("abstract"))),
                   ("status", lambda: docs.set_status(root, p.id, p.text("status"))),
                   ("body", lambda: docs.replace(root, p.id, str(p.get("body")), self._author(root, p))))
        for field, change in changes:
            if p.has(field):
                ok, message = change()
                if not ok:
                    return Result("refused", message)
                said.append(message)
        if not said:
            return Result("refused", say("nothing_to_change"))
        return Result("ok", "\n".join(said))

    def destroy(self, root: Path, p: Payload) -> Result:
        return Result.of(_docs().strike(root, p.id, p.text("why")))

    def part(self, root: Path, p: Payload) -> Result:
        return Result.of(_docs().part(root, p.id, p.text("title"), str(p.get("body") or ""), self._author(root, p)),
                         created=True)

    def final(self, root: Path, p: Payload) -> Result:
        return Result.of(_docs().set_status(root, p.id, "final"))

    def draft(self, root: Path, p: Payload) -> Result:
        return Result.of(_docs().set_status(root, p.id, "draft"))

    def move(self, root: Path, p: Payload) -> Result:
        docs = _docs()
        dst, to_project = p.text("environment"), bool(p.get("global"))
        if to_project and dst:
            return Result("refused", say("move_both", doc=p.id, dst=dst))
        if not (dst or to_project):
            return Result("refused", say("move_where"))
        return Result.of(docs.move(root, p.id, docs.GLOBAL if to_project else dst))

    def supersede(self, root: Path, p: Payload) -> Result:
        return Result.of(_docs().supersede(root, p.id, p.text("new")))

    def attach(self, root: Path, p: Payload) -> Result:
        if p.source == "web":
            return Result("refused", say("attach_here"))
        return Result.of(_docs().attach(root, p.id, str(p.get("path") or ""), p.text("title"), self._author(root, p),
                                        replace=bool(p.get("replace"))))

    def detach(self, root: Path, p: Payload) -> Result:
        return Result.of(_docs().detach(root, p.id, p.text("name"), p.text("why")))

    def files(self, root: Path, p: Payload) -> Result:
        return Result.of(_docs().list_attachments(root, str(p.id or "")))

    def adopt(self, root: Path, p: Payload) -> Result:
        return Result("ok", "\n".join(_docs().adopt(root, self._author(root, p))))

    def search(self, root: Path, p: Payload) -> Result:
        docs = _docs()
        term = str(p.get("term") or "")
        needle = term.lower()
        if not needle:
            return Result("refused", say("search_wants"))
        every = docs.search_lines(root, all_of_them=True)
        lines = every if p.get("all") else docs.search_lines(root, track=self._author(root, p))
        hits = [{"ref": ref, "title": title, "line": i, "text": line}
                for ref, title, i, line in lines if needle in line.lower()]
        elsewhere = len([1 for _, _, _, line in every if needle in line.lower()]) - len(hits)
        return Result("ok", "", hits, {"elsewhere": elsewhere})
