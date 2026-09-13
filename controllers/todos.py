from __future__ import annotations

import re
from pathlib import Path

import fmt
import questions
import state
import todo
import work
from controller import Controller, Payload, Result
from templates import render

MESSAGES = {
    "closed": "to-do {n} is closed ({how}); reopen it before changing it",
    "say_why": "say why it is abandoned",
    "dropped": "dropped: {why}",
    "nothing_to_change": "send a title, a body or a priority to change",
    "closed_waiting": "\n  closed the work `{title}` — it waits on the answer",
    "closed_aside": "\n  closed the work `{title}` — it is set aside",
    "closed_note": "\n  {note}",
    "after_note": "\n  {note}",
}


def say(message: str, /, **values) -> str:
    return render(MESSAGES[message], **values)


class TodosController(Controller):
    resource = "todos"
    noun = "to-do"
    actions = ("index", "show", "store", "update", "destroy", "done", "reopen", "start", "move", "ask",
               "answer", "block", "unblock", "after", "report", "priority", "amend", "replace")
    numbered = actions[1:2] + actions[3:]
    # a closed row is the record of how it ended; reopening is the only way to change it
    EDITS = frozenset({"update", "destroy", "done", "start", "move", "ask", "block", "unblock", "after",
                       "report", "priority", "amend", "replace"})

    @staticmethod
    def env(root: Path) -> str:
        return state.current_track(root)

    def repository(self, root: Path, p: Payload):
        from resources import Todos
        return Todos(root, self.env(root))

    def guard(self, root: Path, action: str, p: Payload) -> Result | None:
        if action not in self.EDITS:
            return None
        t = self.repository(root, p).find(p.id)
        if t.closed:
            return Result("refused", say("closed", n=p.id, how=t.how or "done"))
        return None

    def _close_work(self, root: Path, n: int, at: str, key: str) -> str:
        t = self.repository(root, Payload(self.env(root), n, {})).find(n)
        if not t or not any(w["subject"] == t.title for w in work.open_work(root)):
            return ""
        closed, note = work.end(root, t.title, at)
        return say(key, title=t.title) if closed else say("closed_note", note=note)

    def index(self, root: Path, p: Payload) -> Result:
        env, repo = self.env(root), self.repository(root, p)
        every = repo.all()
        query = repo.query().where(lambda t: not t.closed) if p.get("open") else repo.query()
        if p.source == "cli" and not p.text("sort") and not p.get("order-by-id"):
            # the terminal lists by priority, highest first; ties newest first
            direction = p.text("order") or fmt.DESC
            query = query.order_by("n", direction).order_by("priority", direction)
        else:
            query = self.sorted(query, p)
            if isinstance(query, Result):
                return query
        page = self.paged(query, p)
        waiting = len([t for t in every if not t.closed])
        return Result("ok", "", [todo.row_response(root, env, t.raw) for t in page.rows],
                      {"env": env, "waiting": waiting, "done": len(every) - waiting, "left": page.left,
                       "auto": todo.auto(root, env)})

    def show(self, root: Path, p: Payload) -> Result:
        env, t = self.env(root), self.repository(root, p).find(p.id)
        row = todo.detail(root, env, t.raw)
        row.update(questions=[questions.row_response(n, q) for n, q in questions.about(root, f"todo:{p.id}", env)])
        return Result("ok", "", row)

    def store(self, root: Path, p: Payload) -> Result:
        env = self.env(root)
        ok, message = todo.add(root, env, str(p.get("title") or ""), str(p.get("body") or ""), p.at,
                               p.get("where") or {})
        added = re.search(r"to-do (\d+)", message) if ok else None
        after = p.text("after") or p.text("needs")
        if added and after:
            _, note = todo.after(root, env, int(added.group(1)), after)
            message += say("after_note", note=note)
        return Result("created" if ok else "refused", message, {"n": int(added.group(1))} if added else None)

    def update(self, root: Path, p: Payload) -> Result:
        env, said = self.env(root), []
        changes = (("title", lambda: todo.retitle(root, env, p.id, p.text("title"))),
                   ("body", lambda: todo.replace_section(root, env, p.id, "", str(p.get("body") or ""))),
                   ("priority", lambda: todo.priority(root, env, p.id, p.text("priority"))))
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
        why = p.text("why")
        if not why:
            return Result("refused", say("say_why"))
        return Result.of(todo.done(root, self.env(root), p.id, say("dropped", why=why), p.at))

    def done(self, root: Path, p: Payload) -> Result:
        return Result.of(todo.done(root, self.env(root), p.id, p.text("how"), p.at))

    def reopen(self, root: Path, p: Payload) -> Result:
        return Result.of(todo.reopen(root, self.env(root), p.id, p.text("why"), p.at))

    def start(self, root: Path, p: Payload) -> Result:
        t, err = todo.start(root, self.env(root), p.id, p.at, agent=p.text("as"))
        if t is None:
            return Result("refused", err)
        return Result.of(work.start(root, t["title"], p.at, p.get("where")), {"n": p.id, "title": t["title"]})

    def move(self, root: Path, p: Payload) -> Result:
        return Result.of(todo.move(root, self.env(root), p.id, p.text("environment"), p.at))

    def ask(self, root: Path, p: Payload) -> Result:
        ok, message = todo.ask(root, self.env(root), p.id, p.text("question"))
        return Result.of((ok, message + self._close_work(root, p.id, p.at, "closed_waiting") if ok else message))

    def answer(self, root: Path, p: Payload) -> Result:
        return Result.of(todo.answer(root, self.env(root), p.id, p.text("answer")))

    def block(self, root: Path, p: Payload) -> Result:
        ok, message = todo.block(root, self.env(root), p.id, p.text("why"))
        return Result.of((ok, message + self._close_work(root, p.id, p.at, "closed_aside") if ok else message))

    def unblock(self, root: Path, p: Payload) -> Result:
        return Result.of(todo.unblock(root, self.env(root), p.id))

    def after(self, root: Path, p: Payload) -> Result:
        names = "--none" if p.get("none") else p.text("names")
        return Result.of(todo.after(root, self.env(root), p.id, names))

    def report(self, root: Path, p: Payload) -> Result:
        return Result.of(todo.report(root, self.env(root), p.id, p.text("how"), p.text("as")))

    def priority(self, root: Path, p: Payload) -> Result:
        return Result.of(todo.priority(root, self.env(root), p.id, p.text("value")))

    def amend(self, root: Path, p: Payload) -> Result:
        return Result.of(todo.amend(root, self.env(root), p.id, p.text("title"), str(p.get("body") or "")))

    def replace(self, root: Path, p: Payload) -> Result:
        return Result.of(todo.replace_section(root, self.env(root), p.id, p.text("title"), str(p.get("body") or "")))
