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
    actions = ("index", "show", "store", "update", "destroy", "note", "end", "wait")
    numbered = ("show", "update", "destroy")
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
    def _row(w) -> dict:
        return {"n": w.n, "subject": w.subject, "at": w.at, "age": pins.age(w.at) if w.at else "",
                "ended": w.ended, "awaiting": (w.awaiting or {}).get("what") or "",
                "notes": [{"at": x.get("at", ""), "text": x.get("text", "")} for x in w.notes]}

    def index(self, root: Path, p: Payload) -> Result:
        repo = self.repository(root, p)
        query = repo.query() if p.get("all") else repo.query().where(lambda w: w.open)
        query = self.sorted(query, p)
        if isinstance(query, Result):
            return query
        page = self.paged(query, p)
        return Result("ok", "", [self._row(w) for w in page.rows], {"left": page.left})

    def show(self, root: Path, p: Payload) -> Result:
        return Result("ok", "", self._row(self.repository(root, p).find(p.id)))

    def store(self, root: Path, p: Payload) -> Result:
        return Result.of(work.start(root, p.text("subject"), p.at, p.get("where")), created=True)

    def update(self, root: Path, p: Payload) -> Result:
        return Result.of(work.note(root, p.text("text"), p.at, self.repository(root, p).find(p.id).subject))

    def note(self, root: Path, p: Payload) -> Result:
        return Result.of(work.note(root, p.text("text"), p.at, p.text("on") or None))

    def destroy(self, root: Path, p: Payload) -> Result:
        return self._end(root, p, self.repository(root, p).find(p.id).subject)

    def end(self, root: Path, p: Payload) -> Result:
        if not p.text("subject") and not p.get("force"):
            return Result("refused", say("end_words"))
        return self._end(root, p, p.text("subject"))

    def _end(self, root: Path, p: Payload, subject: str) -> Result:
        ok, message = work.end(root, subject, p.at, bool(p.get("force")))
        if not ok:
            return Result("refused", message)
        env = state.current_track(root)
        meta = {"standing": len(pins.live(root, pins.RULES)) + len(pins.live(root))}
        row = todo.titled(root, env, subject)
        if row and (p.get("todo") or p.get("todos")):
            closed, note = todo.close_titled(root, env, subject, p.at, p.text("as"))
            meta.update(todo_closed=closed, todo_note=note)
        elif row:
            meta["todo_open"] = row["n"]
        return Result("ok", message, None, meta)

    def wait(self, root: Path, p: Payload) -> Result:
        conf, _ = settings_mod.load(root)
        minutes = float(p.get("for")) if p.get("for") is not None else conf["await_default_minutes"]
        cap = conf["await_max_minutes"]
        outcome = work.wait(root, p.text("what"), min(minutes, cap), p.at, time.time(), p.text("on") or None,
                            p.text("agent") or None, int(p.get("pid")) if p.get("pid") else None)
        return Result.of(outcome, meta={"capped": cap if minutes > cap else None})
