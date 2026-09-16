from __future__ import annotations

import time
from pathlib import Path

import fmt
import pins
import settings as settings_mod
import state
import todo
import work
from controller import Controller, Payload, Result
from payloads import work as work_payloads
from payloads.common import ListingPayload
from templates import render

MESSAGES = {
    "ended": "work {n} has ended; ended work does not change",
    "end_words": 'work end wants the words: journal work end "<the work>"',
}


def say(message: str, /, **values) -> str:
    return render(MESSAGES[message], **values)


class WorkController(Controller):
    resource = "work"
    noun = "work"
    actions = ("index", "show", "store", "update", "destroy", "note", "end", "wait", "park")
    numbered = ("show", "update", "destroy")
    payloads = {"index": ListingPayload, "store": work_payloads.StartPayload, "update": work_payloads.NotePayload,
                "destroy": work_payloads.EndPayload, "note": work_payloads.NotePayload, "end": work_payloads.EndPayload,
                "wait": work_payloads.WaitPayload, "park": work_payloads.ParkPayload}
    default_direction = fmt.ASC
    EDITS = frozenset({"update", "destroy"})

    def repository(self, root: Path, p: Payload):
        from resources import WorkLog
        return WorkLog(root, p.env)

    def guard(self, root: Path, action: str, p: Payload) -> Result | None:
        if action in self.EDITS and not self.repository(root, p).find(p.id).open:
            return Result("refused", say("ended", n=p.id))
        return None

    @staticmethod
    def _todos(root: Path, env: str) -> dict:
        return {"by_n": {t["n"]: t for t in todo._all(root, env)},
                "by_title": {t["title"].lower(): t for t in todo._all(root, env)}}

    @staticmethod
    def _row(w, todos: dict) -> dict:
        t = todos["by_n"].get(int(w.todo)) if str(w.todo).isdigit() else todos["by_title"].get(w.subject.lower())
        return {"n": w.n, "subject": w.subject, "at": w.at, "age": pins.age(w.at) if w.at else "",
                "ended": w.ended, "ended_age": pins.age(w.ended) if w.ended else "", "closed_at": w.ended or "",
                "awaiting": (w.awaiting or {}).get("what") or "",
                "parked": (w.parked or {}).get("why") or "",
                "parked_at": (w.parked or {}).get("at") or "",
                "parked_age": pins.age((w.parked or {}).get("at") or "") if (w.parked or {}).get("at") else "",
                "todo": t["n"] if t else None, "doc": (t.get("doc") or None) if t else None,
                # each note carries when it was written, through the same age() every other row uses
                "notes": [{"at": x.get("at", ""), "age": pins.age(x.get("at", "")) if x.get("at") else "",
                           "text": x.get("text", "")} for x in w.notes],
                "files": [{"path": f.get("path", ""), "created": bool(f.get("created")), "added": f.get("added", 0),
                           "removed": f.get("removed", 0)} for f in w.files],
                "commits": [{"sha": c.get("sha", ""), "subject": c.get("subject", ""), "at": c.get("at", "")} for c in w.commits]}

    def index(self, root: Path, p: ListingPayload) -> Result:
        repo = self.repository(root, p)
        query = repo.query() if p.all else repo.query().where(lambda w: w.open)
        query = self.sorted(query, p)
        if isinstance(query, Result):
            return query
        page = self.paged(query, p)
        todos = self._todos(root, p.env)
        return Result("ok", "", [self._row(w, todos) for w in page.rows], {"left": page.left})

    def show(self, root: Path, p: Payload) -> Result:
        return Result("ok", "", self._row(self.repository(root, p).find(p.id), self._todos(root, p.env)))

    def store(self, root: Path, p: work_payloads.StartPayload) -> Result:
        subject = " ".join((p.subject or "").split()).lower()
        env = p.env or state.current_track(root)
        match = next((r["n"] for r in todo._all(root, env) if not r.get("done") and r["title"].lower() == subject), None)
        where = {**(p.where or {}), **({"todo": match} if match else {})}
        return Result.of(work.start(root, p.subject, p.at, where), created=True)

    def update(self, root: Path, p: work_payloads.NotePayload) -> Result:
        return Result.of(work.note(root, p.text, p.at, self.repository(root, p).find(p.id).subject))

    def note(self, root: Path, p: work_payloads.NotePayload) -> Result:
        return Result.of(work.note(root, p.text, p.at, p.on or None))

    def destroy(self, root: Path, p: work_payloads.EndPayload) -> Result:
        return self._end(root, p, self.repository(root, p).find(p.id).subject)

    def end(self, root: Path, p: work_payloads.EndPayload) -> Result:
        if not p.subject and not p.force:
            return Result("refused", say("end_words"))
        return self._end(root, p, p.subject)

    def _end(self, root: Path, p: work_payloads.EndPayload, subject: str) -> Result:
        ok, message = work.end(root, subject, p.at, p.force)
        if not ok:
            return Result("refused", message)
        env = state.current_track(root)
        meta = {"standing": len(pins.live(root, pins.RULES)) + len(pins.live(root))}
        row = todo.titled(root, env, subject)
        if row and (p.todo or p.todos):
            closed, note = todo.close_titled(root, env, subject, p.at, p.agent)
            meta.update(todo_closed=closed, todo_note=note)
        elif row:
            meta["todo_open"] = row["n"]
        return Result("ok", message, None, meta)

    def park(self, root: Path, p: work_payloads.ParkPayload) -> Result:
        return Result.of(work.park(root, p.why, p.at, p.on or None))

    def wait(self, root: Path, p: work_payloads.WaitPayload) -> Result:
        conf, _ = settings_mod.load(root)
        minutes = p.minutes if p.minutes is not None else conf["await_default_minutes"]
        cap = conf["await_max_minutes"]
        outcome = work.wait(root, p.what, min(minutes, cap), p.at, time.time(), p.on or None, p.agent or None, p.pid)
        return Result.of(outcome, meta={"capped": cap if minutes > cap else None})
