import time
from controllers.base import Controller, internal, CONTROLLERS
from resources import types
from resources.base import SYSTEM, Refused
from resources.shapes import LEVELS, priority_level, rank_before
from controllers.questions import Questions


def task_state(row, works: dict) -> str:
    if row.completed:
        return "done"
    if row.n in works:
        return "doing"
    return "waiting"


class Todos(Controller):
    resource = types.Todo

    def assign(self, n: int, to: str = "", off: bool = False):
        if not to and not off:
            raise Refused("assign names an agent with --to, or --off to put the row back")
        return self.update(n, assigned="" if off else to)

    def task(self, agent: str, title: str, brief: str = ""):
        return self.create(title, brief=brief, assigned=agent, hidden=True)

    def tasks(self, agent: str) -> list[dict]:
        from controllers.works import Works
        works = {int(w.todo): w for w in Works(self.record, actor=SYSTEM)._standing() if w.todo}
        rows = [self.load(row["n"]) for row in self.summaries() if row.get("assigned") == agent and not row["deleted"]]
        return [{"n": r.n, "title": r.title, "hidden": bool(r.hidden), "state": task_state(r, works)} for r in rows]

    def report(self, n: int, how: str):
        if not self.agent:
            raise Refused("report is a subagent's word — the dispatcher closes a row with done")
        return self.update(n, reported={"agent": self.agent, "dispatcher": self.session, "how": how, "at": time.time()})

    def ask(self, n: int, question: str, **data):
        row = self.load(n)
        return Questions(self.record, actor=self.actor).create(question, about=row.ref, **data)

    def answer(self, n: int, text: str):
        questions = Questions(self.record, actor=self.actor)
        row = self.load(n)
        for q in questions.linked_to(row.ref):
            if not q.completed:
                return questions.complete(q.n, text)
        raise Refused(f"todo {n} has no open question")

    def block(self, n: int, why: str):
        return self.update(n, blocked=why)

    def unblock(self, n: int):
        return self.update(n, blocked="")

    def after(self, n: int, waits: str, off: bool = False):
        row = self.load(n)
        kind, _, num = (str(waits) if ":" in str(waits) else f"todo:{waits}").partition(":")
        if not self.waitable(kind) or not num.isdigit():
            raise Refused("a to-do waits on another to-do or a plan: a number, todo:<n> or plan:<n>")
        ref = self.waitable(kind)(self.record, actor=SYSTEM).load(int(num)).ref
        if ref == row.ref or row.ref in self.chain(ref):
            raise Refused(f"todo {n} waiting on {ref} would wait on itself")
        held = list(row.after or [])
        return self.update(n, after=[r for r in held if r != ref] if off else held + [ref] * (ref not in held))

    @internal
    def waitable(self, kind: str):
        return {"todo": Todos, "plan": CONTROLLERS.get("plan")}.get(kind)

    @internal
    def chain(self, ref: str) -> set[str]:
        seen, todo = set(), [ref]
        while todo:
            kind, _, num = todo.pop().partition(":")
            if kind != "todo" or f"todo:{num}" in seen:
                continue
            seen.add(f"todo:{num}")
            todo.extend(self.load(int(num)).after or [])
        return seen

    @internal
    def waits(self, row) -> list[str]:
        open_ = []
        for ref in row.after or []:
            kind, _, num = ref.partition(":")
            try:
                rows = self.waitable(kind)(self.record, actor=SYSTEM)
                other = rows.load(int(num))
            except (TypeError, ValueError, Refused):
                continue
            if not rows._finished(other) and not other.deleted:
                open_.append(ref)
        return open_

    @internal
    def mark(self, r) -> str:
        if r.type != self.type:
            return ""
        if r.completed:
            return "  [done]"
        if r.blocked:
            return f"  [blocked: {r.blocked}]"
        waits = self.waits(r)
        return f"  [waits on {', '.join(w.replace(':', ' ') for w in waits)}]" if waits else ""

    def strike(self, n: int, why: str):
        return self.complete(n, f"struck: {why}", struck=True)

    def start(self, n: int):
        self._handled("start", n=n)
        row = self.load(n)
        from controllers.works import Works
        return Works(self.record, actor=self.actor, session=self.session, agent=self.agent).create(row.title, brief=row.brief, todo=row.n)

    def prune(self, days: int = 30):
        cut = time.time() - int(days) * 86400
        gone = [r for r in self._every() if r.completed and r.completed < cut]
        for r in gone:
            self.delete(r.n, f"pruned after {days} days")
        return gone

    def priority(self, n: int, value: str):
        return self.update(int(n), priority=priority_level(value))

    def place(self, n: int, before: int):
        todo, target = self.load(int(n)), self.load(int(before))
        level = int(target.priority or LEVELS["default"])
        column = [t for t in self._ordered(self._standing()) if t.n != todo.n and int(t.priority or LEVELS["default"]) == level]
        return self.update(todo.n, priority=level, rank=rank_before(column, target.n))

    def _standing(self, closed_since: float = 0, closed_last: int = 0) -> list:
        return [r for r in super()._standing(closed_since, closed_last) if not r.hidden]

    def _ordered(self, rows: list) -> list:
        return sorted(rows, key=lambda t: (-int(t.priority or LEVELS["default"]), t.position, t.n))

    def _every(self, deleted: bool = False) -> list:
        return self._ordered(super()._every(deleted))
