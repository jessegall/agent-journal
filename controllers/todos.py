from __future__ import annotations

import re
from pathlib import Path

import fmt
import questions
import state
import todo
import work
from controller import Controller, Payload, Result
from payloads import todos as todo_payloads
from payloads.common import AnswerPayload, MovePayload, SectionPayload, WhyPayload
from templates import render

MESSAGES = {
    "closed": "to-do {n} is closed ({how}); reopen it before changing it",
    "say_why": "say why it is abandoned",
    "dropped": "dropped: {why}",
    "nothing_to_change": "send a title, a body or a priority to change",
    "parked_waiting": "\n  parked the work `{title}` — it waits on the answer, and is not finished",
    "parked_aside": "\n  parked the work `{title}` — it is set aside, and is not finished",
    "closed_note": "\n  {note}",
    "closed_done": "\n  ended the work `{title}` with it",
    "after_note": "\n  {note}",
    "no_commit": "no commit at {ref} to read",
    "commit_how": "{subject} ({sha})",
}


def say(message: str, /, **values) -> str:
    return render(MESSAGES[message], **values)


class TodosController(Controller):
    resource = "todos"
    noun = "to-do"
    actions = ("index", "show", "store", "update", "destroy", "done", "reopen", "start", "move", "ask",
               "answer", "block", "unblock", "after", "report", "priority", "amend", "replace", "prune", "keep", "commit")
    numbered = ("show", "update", "destroy", "done", "reopen", "start", "move", "ask", "answer", "block", "unblock",
                "after", "report", "priority", "amend", "replace")
    payloads = {"index": todo_payloads.ListPayload, "store": todo_payloads.StorePayload,
                "update": todo_payloads.UpdatePayload, "destroy": WhyPayload, "done": todo_payloads.HowPayload,
                "reopen": WhyPayload, "start": todo_payloads.StartPayload, "move": MovePayload,
                "ask": todo_payloads.AskPayload, "answer": AnswerPayload, "block": WhyPayload,
                "after": todo_payloads.AfterPayload, "report": todo_payloads.ReportPayload,
                "priority": todo_payloads.PriorityPayload, "amend": SectionPayload, "replace": SectionPayload,
                "prune": todo_payloads.PrunePayload,
                "keep": todo_payloads.KeepPayload,
                "commit": todo_payloads.CommitPayload}
    # a closed row is the record of how it ended; reopening is the only way to change it
    EDITS = frozenset({"update", "destroy", "done", "start", "move", "ask", "block", "unblock", "after",
                       "report", "priority", "amend", "replace"})

    @staticmethod
    def env(root: Path) -> str:
        return state.current_track(root)

    def repository(self, root: Path, p: Payload | None = None):
        from resources import Todos
        return Todos(root, self.env(root))

    def guard(self, root: Path, action: str, p: Payload) -> Result | None:
        if action not in self.EDITS:
            return None
        t = self.repository(root, p).find(p.id)
        if t.closed:
            return Result("refused", say("closed", n=p.id, how=t.how or "done"))
        return None

    def _park_work(self, root: Path, n: int, at: str, key: str, why: str) -> str:
        t = self.repository(root).find(n)
        if not t or not any(w["subject"] == t.title for w in work.open_work(root)):
            return ""
        parked, note = work.park(root, why, at, on=t.title)
        return say(key, title=t.title) if parked else say("closed_note", note=note)

    def _close_work(self, root: Path, n: int, at: str, key: str) -> str:
        t = self.repository(root).find(n)
        if not t or not any(w["subject"] == t.title for w in work.open_work(root)):
            return ""
        closed, note = work.end(root, t.title, at)
        return say(key, title=t.title) if closed else say("closed_note", note=note)

    def index(self, root: Path, p: todo_payloads.ListPayload) -> Result:
        env, repo = self.env(root), self.repository(root, p)
        every = repo.all()
        query = repo.query().where(lambda t: not t.closed) if p.open else repo.query()
        if p.source == "cli" and not p.sort and not p.order_by_id:
            # the terminal lists by priority, highest first; ties newest first
            direction = p.order or fmt.DESC
            query = query.order_by("n", direction).order_by("priority", direction)
        else:
            query = self.sorted(query, p)
            if isinstance(query, Result):
                return query
        page = self.paged(query, p)
        waiting = len([t for t in every if not t.closed])
        counts = todo.question_counts(root, env)
        by_n = {x["n"]: x for x in todo._all(root, env)}
        return Result("ok", "", [todo.row_response(root, env, t.raw, counts=counts, by_n=by_n) for t in page.rows],
                      {"env": env, "waiting": waiting, "done": len(every) - waiting, "left": page.left,
                       "auto": todo.auto(root)})

    def show(self, root: Path, p: Payload) -> Result:
        env, t = self.env(root), self.repository(root, p).find(p.id)
        row = todo.detail(root, env, t.raw)
        row.update(questions=[questions.row_response(n, q) for n, q in questions.about(root, f"todo:{p.id}", env)],
                   from_messages=__import__("inbox").sources(root, f"todo:{p.id}", env))
        return Result("ok", "", row)

    def store(self, root: Path, p: todo_payloads.StorePayload) -> Result:
        env = self.env(root)
        ok, message = todo.add(root, env, p.title, p.body, p.at, p.where)
        added = re.search(r"to-do (\d+)", message) if ok else None
        after = p.after or p.needs
        if added and after:
            _, note = todo.after(root, env, int(added.group(1)), after)
            message += say("after_note", note=note)
        if added and p.priority and p.priority.lower() != "default":
            set_ok, said = todo.priority(root, env, int(added.group(1)), p.priority)
            message += "\n" + said
        # after the dependency is stored, never before it: --after arrives here, not in `todo.add`
        if added:
            message += todo.mentions_hint(root, env, int(added.group(1)), p.body or "")
        return Result("created" if ok else "refused", message, {"n": int(added.group(1))} if added else None)

    def update(self, root: Path, p: todo_payloads.UpdatePayload) -> Result:
        env, said = self.env(root), []
        changes = (("title", lambda: todo.retitle(root, env, p.id, p.title)),
                   ("body", lambda: todo.replace_section(root, env, p.id, "", p.body)),
                   ("priority", lambda: todo.priority(root, env, p.id, p.priority)))
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
        if not p.why:
            return Result("refused", say("say_why"))
        got = todo.done(root, self.env(root), p.id, say("dropped", why=p.why), p.at)
        if got[0]:
            # ABANDONED, NOT FINISHED: a row that waits on this one stays waiting (`todo.waiting_on`)
            todo._update(root, self.env(root), p.id, struck="1")
        return self._closed(root, p, got)

    def done(self, root: Path, p: todo_payloads.HowPayload) -> Result:
        return self._closed(root, p, todo.done(root, self.env(root), p.id, p.how, p.at))

    def _closed(self, root: Path, p, got: tuple[bool, str]) -> Result:
        if got[0] and p.source == "web":
            todo._update(root, self.env(root), p.id, closed_by="web")
        if got[0]:
            got = (True, got[1] + self._close_work(root, p.id, p.at, "closed_done"))
        return Result.of(got)

    def reopen(self, root: Path, p: WhyPayload) -> Result:
        return Result.of(todo.reopen(root, self.env(root), p.id, p.why, p.at))

    def start(self, root: Path, p: todo_payloads.StartPayload) -> Result:
        before = todo.item(root, self.env(root), p.id)[0] or {}
        t, err = todo.start(root, self.env(root), p.id, p.at, agent=p.agent)
        if t is None:
            return Result("refused", err)
        opened = work.start(root, t["title"], p.at, {**(p.where or {}), "todo": p.id})
        if not opened[0]:
            # A REFUSED START CHANGES NOTHING. The row was marked started before its work was refused,
            # so the refusal said no while the record said yes.
            todo._update(root, self.env(root), p.id, started=before.get("started", ""), assigned=before.get("assigned", ""))
        return Result.of(opened, {"n": p.id, "title": t["title"], "body": t.get("body") or ""})

    def move(self, root: Path, p: MovePayload) -> Result:
        return Result.of(todo.move(root, self.env(root), p.id, p.environment, p.at))

    def ask(self, root: Path, p: todo_payloads.AskPayload) -> Result:
        ok, message = todo.ask(root, self.env(root), p.id, p.question)
        return Result.of((ok, message + self._park_work(root, p.id, p.at, "parked_waiting",
                                                        f"waiting on the user: {p.question}") if ok else message))

    def answer(self, root: Path, p: AnswerPayload) -> Result:
        return Result.of(todo.answer(root, self.env(root), p.id, p.answer))

    def block(self, root: Path, p: WhyPayload) -> Result:
        ok, message = todo.block(root, self.env(root), p.id, p.why)
        return Result.of((ok, message + self._park_work(root, p.id, p.at, "parked_aside", p.why) if ok else message))

    def unblock(self, root: Path, p: Payload) -> Result:
        return Result.of(todo.unblock(root, self.env(root), p.id))

    def after(self, root: Path, p: todo_payloads.AfterPayload) -> Result:
        return Result.of(todo.after(root, self.env(root), p.id, "--none" if p.none else p.names))

    def report(self, root: Path, p: todo_payloads.ReportPayload) -> Result:
        return Result.of(todo.report(root, self.env(root), p.id, p.how, p.agent))

    def priority(self, root: Path, p: todo_payloads.PriorityPayload) -> Result:
        return Result.of(todo.priority(root, self.env(root), p.id, p.value))

    def amend(self, root: Path, p: SectionPayload) -> Result:
        return self._said(root, p, todo.amend(root, self.env(root), p.id, p.title, p.body))

    def _said(self, root: Path, p, got: tuple[bool, str]) -> Result:
        if got[0]:
            got = (True, got[1] + todo.mentions_hint(root, self.env(root), p.id, p.body or ""))
        return Result.of(got)

    def replace(self, root: Path, p: SectionPayload) -> Result:
        return self._said(root, p, todo.replace_section(root, self.env(root), p.id, p.title, p.body))

    def keep(self, root: Path, p: todo_payloads.KeepPayload) -> Result:
        return Result.of(todo.set_archive_days(root, self.env(root), p.days))

    def prune(self, root: Path, p: todo_payloads.PrunePayload) -> Result:
        return Result.of(todo.prune(root, self.env(root), p.older_than or p.before, p.at, p.force))

    def commit(self, root: Path, p: todo_payloads.CommitPayload) -> Result:
        ref = p.ref or "HEAD"
        found = todo.commit_at(root.parent, ref)
        if found is None:
            return Result("refused", say("no_commit", ref=ref))
        sha, subject, message = found
        said = todo.close_from_commit(root, message, say("commit_how", subject=subject, sha=sha[:9]), p.at,
                                      self.env(root))
        closed = not said or any(ok for ok, _ in said)
        return Result("ok" if closed else "refused", "", [{"ok": ok, "line": line} for ok, line in said],
                      {"sha": sha[:9]})
