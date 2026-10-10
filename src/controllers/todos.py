import time
from typing import TypedDict

from controllers.base import Controller, CONTROLLERS
from controllers.prioritised import Prioritised
from resources import types
from resources.base import SYSTEM, Refused
from resources.shapes import CHANGE, COMMIT, LEVELS, rank_before
from controllers.questions import Questions
from controllers.marks import action


class Touched(TypedDict):
    changed: list[dict]
    commits: list[dict]


def task_state(row, works: dict) -> str:
    if row.completed:
        return "done"
    if row.n in works:
        return "doing"
    return "waiting"


def column_order(todo) -> tuple:
    """Where a to-do stands in its column: higher priority first, then the place it was dropped at, then its number; the key a board pages its lanes by."""
    return (-int(todo.priority or LEVELS["default"]), todo.position, todo.n)


class Todos(Prioritised, Controller):
    resource = types.Todo

    @action
    def assign(self, n: int, to: str):
        return self.update(n, assigned=to, pending=None)

    @action
    def unassign(self, n: int, **data):
        return self.update(n, assigned="", pending=None, **data)

    @action
    def complete(self, n: int, how: str = "", **data):
        data.setdefault("pending", None)
        return super().complete(n, how, **data)

    @action
    def reopen(self, n: int, why: str):
        row = self.load(n)
        if row.pending and not row.completed:
            return self.update(n, pending=None)
        return super().reopen(n, why)

    @action
    def task(self, agent: str, title: str, brief: str = ""):
        return self.create(title, brief=brief, assigned=agent, hidden=True)

    @action
    def tasks(self, agent: str) -> list[dict]:
        from controllers.works import Works
        works = {int(w.todo): w for w in Works(self.record, actor=SYSTEM).rows.standing() if w.todo}
        rows = [self.load(row["n"]) for row in self.rows.summaries() if row.get("assigned") == agent and not row["deleted"]]
        return [{"n": r.n, "title": r.title, "hidden": bool(r.hidden), "state": task_state(r, works)} for r in rows]

    @action
    def touched(self, n: int) -> Touched:
        """The files the to-do's work changed and the commits made while it ran, newest work last."""
        from controllers.works import Works
        works = Works(self.record, actor=SYSTEM)
        own = sorted((works.load(row["n"]) for row in works.rows.summaries() if row.get("todo") == n and not row["deleted"]), key=lambda w: w.created)
        changed = {f[CHANGE.path]: f for w in own for f in w.changed}
        commits = {c[COMMIT.sha]: c for w in own for c in w.commits}
        return Touched(changed=list(changed.values()), commits=list(commits.values()))

    @action
    def report(self, n: int, how: str):
        if not self.agent:
            raise Refused("report is a subagent's word — the dispatcher closes a row with done")
        return self.update(n, reported={"agent": self.agent, "dispatcher": self.session, "how": how, "at": time.time()})

    @action
    def ask(self, n: int, question: str, **data):
        row = self.load(n)
        return Questions(self.record, actor=self.actor).create(question, about=row.ref, **data)

    @action
    def answer(self, n: int, text: str):
        questions = Questions(self.record, actor=self.actor)
        row = self.load(n)
        for q in questions.linked_to(row.ref):
            if not q.completed:
                return questions.complete(q.n, text)
        raise Refused(f"todo {n} has no open question")

    @action
    def block(self, n: int, why: str):
        return self.update(n, blocked=why)

    @action
    def unblock(self, n: int):
        return self.update(n, blocked="")

    @action
    def after(self, n: int, waits: str, off: bool = False):
        row = self.load(n)
        kind, _, num = (str(waits) if ":" in str(waits) else f"todo:{waits}").partition(":")
        if not self.waitable(kind) or not num.isdigit():
            raise Refused("a to-do waits on another to-do or a plan: a number, todo:<n> or plan:<n>")
        ref = self.waitable(kind)(self.record, actor=SYSTEM).load(num).ref
        if ref == row.ref or row.ref in self.chain(ref):
            raise Refused(f"todo {n} waiting on {ref} would wait on itself")
        held = list(row.after)
        return self.update(n, after=[r for r in held if r != ref] if off else held + [ref] * (ref not in held))

    def waitable(self, kind: str):
        return {"todo": Todos, "plan": CONTROLLERS.get("plan")}.get(kind)

    def chain(self, ref: str) -> set[str]:
        seen, todo = set(), [ref]
        while todo:
            kind, _, num = todo.pop().partition(":")
            if kind != "todo" or f"todo:{num}" in seen:
                continue
            seen.add(f"todo:{num}")
            todo.extend(self.load(num).after)
        return seen

    def waits(self, row) -> list[str]:
        open_ = []
        for ref in row.after:
            kind, _, num = ref.partition(":")
            try:
                rows = self.waitable(kind)(self.record, actor=SYSTEM)
                other = rows.load(num)
            except (TypeError, ValueError, Refused):
                continue
            if not rows._finished(other) and not other.deleted:
                open_.append(ref)
        return open_

    def mark(self, r) -> str:
        if r.type != self.type:
            return ""
        if r.completed:
            return "  [done]"
        if r.pending:
            return f"  [done by {r.assigned.replace(':', ' ')}, waits for its merge]"
        if r.assigned:
            return f"  [assigned to {r.assigned.replace(':', ' ')}]"
        if r.blocked:
            return f"  [blocked: {r.blocked}]"
        waits = self.waits(r)
        return f"  [waits on {', '.join(w.replace(':', ' ') for w in waits)}]" if waits else ""

    @action
    def strike(self, n: int, why: str):
        return self.complete(n, f"struck: {why}", struck=True)

    @action
    def start(self, n: int):
        self._handled("start", n=n)
        row = self.load(n)
        from controllers.works import Works
        return Works(self.record, actor=self.actor, session=self.session, agent=self.agent, force=self.force).create(row.title, brief=row.brief, todo=row.n)

    @action
    def prune(self, days: int = 30):
        cut = time.time() - int(days) * 86400
        gone = [r for r in self.rows.every() if r.completed and r.completed < cut]
        for r in gone:
            self.delete(r.n, f"pruned after {days} days")
        return gone

    @action
    def place(self, n: int, before: int):
        todo, target = self.load(n), self.load(before)
        level = int(target.priority or LEVELS["default"])
        column = [t for t in self._ordered(self.rows.standing()) if t.n != todo.n and int(t.priority or LEVELS["default"]) == level]
        return self.update(todo.n, priority=level, rank=rank_before(column, target.n))

    def _ordered(self, rows: list) -> list:
        return sorted(rows, key=column_order)
