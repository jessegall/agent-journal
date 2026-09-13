from __future__ import annotations

from pathlib import Path

import state
from controller import Controller, Payload, Result
from payloads import docs as doc_payloads
from payloads.common import SectionPayload, WhyPayload
from templates import render

MESSAGES = {
    "move_both": "`docs move {doc}` was given both `--global` and `{dst}`. A doc belongs to the project or to one "
                 "environment; say which.",
    "move_where": '`journal docs move <doc> "<environment>"` — or `--global` to give it to the project, which lists '
                  "it on every environment",
    "nothing_to_change": "send a title, an abstract, a status or a body to change",
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
               "attach", "detach", "files", "paths", "adopt", "search")
    numbered = ("show", "update", "destroy", "part", "final", "draft", "move", "supersede", "attach", "detach",
                "paths")
    payloads = {"index": doc_payloads.ListPayload, "store": doc_payloads.StorePayload,
                "update": doc_payloads.UpdatePayload, "destroy": WhyPayload, "part": SectionPayload,
                "move": doc_payloads.MovePayload, "supersede": doc_payloads.SupersedePayload,
                "attach": doc_payloads.AttachPayload, "detach": doc_payloads.DetachPayload,
                "files": doc_payloads.FilesPayload, "search": doc_payloads.SearchPayload}

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

    def index(self, root: Path, p: doc_payloads.ListPayload) -> Result:
        docs = _docs()
        every = docs._load(root)
        if p.all:
            shelf = every
        elif p.scope == "here":
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

    def store(self, root: Path, p: doc_payloads.StorePayload) -> Result:
        docs = _docs()
        scope = docs.GLOBAL if p.project or not p.env else p.env
        return Result.of(docs.add(root, p.title, p.abstract, p.body, scope), created=True)

    def update(self, root: Path, p: doc_payloads.UpdatePayload) -> Result:
        docs, said = _docs(), []
        changes = (("title", lambda: docs.set_title(root, p.id, p.title)),
                   ("abstract", lambda: docs.set_abstract(root, p.id, p.abstract)),
                   ("status", lambda: docs.set_status(root, p.id, p.status)),
                   ("body", lambda: docs.replace(root, p.id, p.body, self._author(root, p))))
        for field, change in changes:
            if p.has(field):
                ok, message = change()
                if not ok:
                    return Result("refused", message)
                said.append(message)
        if not said:
            return Result("refused", say("nothing_to_change"))
        return Result("ok", "\n".join(said))

    def destroy(self, root: Path, p: WhyPayload) -> Result:
        return Result.of(_docs().strike(root, p.id, p.why))

    def part(self, root: Path, p: SectionPayload) -> Result:
        return Result.of(_docs().part(root, p.id, p.title, p.body, self._author(root, p)), created=True)

    def final(self, root: Path, p: Payload) -> Result:
        return Result.of(_docs().set_status(root, p.id, "final"))

    def draft(self, root: Path, p: Payload) -> Result:
        return Result.of(_docs().set_status(root, p.id, "draft"))

    def move(self, root: Path, p: doc_payloads.MovePayload) -> Result:
        docs = _docs()
        if p.project and p.environment:
            return Result("refused", say("move_both", doc=p.id, dst=p.environment))
        if not (p.environment or p.project):
            return Result("refused", say("move_where"))
        return Result.of(docs.move(root, p.id, docs.GLOBAL if p.project else p.environment))

    def supersede(self, root: Path, p: doc_payloads.SupersedePayload) -> Result:
        return Result.of(_docs().supersede(root, p.id, p.new))

    def attach(self, root: Path, p: doc_payloads.AttachPayload) -> Result:
        if p.source == "web":
            return Result("refused", say("attach_here"))
        return Result.of(_docs().attach(root, p.id, p.path, p.title, self._author(root, p), replace=p.replace))

    def detach(self, root: Path, p: doc_payloads.DetachPayload) -> Result:
        return Result.of(_docs().detach(root, p.id, p.name, p.why))

    def files(self, root: Path, p: doc_payloads.FilesPayload) -> Result:
        return Result.of(_docs().list_attachments(root, str(p.id or "")))

    def paths(self, root: Path, p: Payload) -> Result:
        docs = _docs()
        doc, _, _ = docs.get(root, p.id.split(".")[0])
        got = [str(x) for x in docs.file_paths(doc)]
        return Result("ok", "\n".join(got) or docs.say("no_paths", n=doc["n"]), got)

    def adopt(self, root: Path, p: Payload) -> Result:
        return Result("ok", "\n".join(_docs().adopt(root, self._author(root, p))))

    def search(self, root: Path, p: doc_payloads.SearchPayload) -> Result:
        docs = _docs()
        needle = p.term.lower()
        if not needle:
            return Result("refused", say("search_wants"))
        every = docs.search_lines(root, all_of_them=True)
        lines = every if p.all else docs.search_lines(root, track=self._author(root, p))
        hits = [{"ref": ref, "title": title, "line": i, "text": line}
                for ref, title, i, line in lines if needle in line.lower()]
        elsewhere = len([1 for _, _, _, line in every if needle in line.lower()]) - len(hits)
        return Result("ok", "", hits, {"elsewhere": elsewhere})
