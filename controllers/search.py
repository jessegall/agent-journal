from __future__ import annotations

from pathlib import Path

from controller import Controller, Result
from payloads.search import SearchPayload
from templates import render

MESSAGES = {
    "search_wants": "search wants a term",
}

PAGE = 25


def say(message: str, /, **values) -> str:
    return render(MESSAGES[message], **values)


class SearchController(Controller):
    resource = "search"
    noun = "search"
    actions = ("index",)
    numbered = ()
    payloads = {"index": SearchPayload}

    def index(self, root: Path, p: SearchPayload) -> Result:
        import tags
        import tracks
        import transcript
        from pins import age
        term = p.term.strip()
        if not term:
            return Result("refused", say("search_wants"))
        needle = term.lower()
        index = tracks.carried_by(root)
        known = {s for stems in index.values() for s in stems}
        wanted = set(index.get(p.env) or [])
        found, total = [], 0
        for path in transcript.sessions(root.parent):
            if not p.all and path.stem in known and path.stem not in wanted:
                continue
            lines, _ = transcript.read(path)
            pool = lines if p.all else transcript.on_track(lines, p.env)
            hits = [line for line in pool if line.spoken and needle in (line.text or "").lower()]
            if hits:
                found.append((path, list(reversed(hits))))
                total += len(hits)
        pages = max(1, -(-total // PAGE))
        page = min(max(1, p.page), pages)
        first, last = (page - 1) * PAGE, page * PAGE
        groups, seen = [], 0
        for path, hits in found:
            take = [line for i, line in enumerate(hits, seen) if first <= i < last]
            seen += len(hits)
            if take:
                groups.append({"session": path.stem, "mine": bool(p.session) and path.stem == p.session,
                               "when": age(take[0].ts) if take[0].ts else "",
                               "lines": [{"n": line.n, "who": "user" if line.kind == "human" else "agent",
                                          "text": transcript.snippet(tags.strip(line.text), term)} for line in take]})
        return Result("ok", "", {"term": term, "env": p.env, "total": total, "page": page, "pages": pages,
                                 "transcript": groups, "resources": self._resources(root, p, needle)})

    @staticmethod
    def _resources(root: Path, p: SearchPayload, needle: str) -> list[dict]:
        from resources import Docs, Messages, Pins, Questions, Reminders, Rules, Todos
        found: list[dict] = []

        def add(kind: str, rows, text) -> None:
            found.extend({"kind": kind, "n": r.n, "text": text(r)} for r in rows if needle in text(r).lower())

        add("todo", Todos(root, p.env).all(), lambda t: t.title)
        add("pin", Pins(root, p.env).query().where(lambda c: c.standing), lambda c: c.fact)
        add("rule", Rules(root).query().where(lambda c: c.standing), lambda c: c.fact)
        add("question", Questions(root, p.env).all(), lambda q: q.text)
        add("message", Messages(root, p.env).all(), lambda m: m.text)
        add("reminder", Reminders(root, p.env).query().where(lambda r: r.standing), lambda r: r.text)
        add("doc", Docs(root).on(p.env), lambda d: f"{d.title} — {d.abstract}")
        return found
