from v2.controllers.base import Controller
from v2.resources import types
from v2.resources.base import AGENT, Refused, check_title


class Messages(Controller):
    resource = types.Message


class Todos(Controller):
    resource = types.Todo


class Works(Controller):
    resource = types.Work


DRAFT, READY, ACTIVE, WAITING, DONE, ABANDONED = "draft", "ready", "active", "waiting", "done", "abandoned"


class Plans(Controller):
    resource = types.Plan

    def create(self, title: str, abstract: str = "", brief: str = "", **data):
        return super().create(title, abstract, brief, status=DRAFT, phases=[], current=1, **data)

    def from_doc(self, doc: int):
        source = CONTROLLERS["doc"](self.record, actor=self.actor).load(int(doc))
        plan = self.create(source.title, brief=source.brief, goal=source.abstract)
        for s in source.sections:
            if s["title"].lower().startswith("phase"):
                self.phase(plan.n, s["title"].split(":", 1)[-1].split("—", 1)[-1].strip() or s["title"], brief=s["body"])
        return self.link(plan.n, source.ref)

    def phases(self, n: int) -> list[dict]:
        return self.load(n).data["phases"]

    def phase(self, n: int, title: str, when: str = "", checkpoint: bool = False, brief: str = "", before: int = 0):
        r = self.load(n)
        made = {"title": check_title(title), "when": check_title(when) if when else "", "checkpoint": bool(checkpoint), "brief": brief, "todos": []}
        r.data["phases"].insert(int(before) - 1 if before else len(r.data["phases"]), made)
        return self.save(r, "updated", phase=r.data["phases"].index(made) + 1)

    def rephrase(self, n: int, p: int, title: str | None = None, when: str | None = None, checkpoint: bool | None = None, brief: str | None = None):
        r = self.load(n)
        phase = self._phase(r, p)
        for key, value in (("title", title), ("when", when), ("checkpoint", checkpoint), ("brief", brief)):
            if value is not None:
                phase[key] = check_title(value) if key in ("title", "when") and value else value
        return self.save(r, "updated", phase=int(p))

    def place(self, n: int, p: int, *todos: int, move: bool = False, off: bool = False):
        r = self.load(n)
        phase = self._phase(r, p)
        for t in (int(x) for x in todos):
            elsewhere = next((i + 1 for i, ph in enumerate(r.data["phases"]) if t in ph["todos"]), 0)
            if off:
                phase["todos"] = [x for x in phase["todos"] if x != t]
                continue
            if elsewhere and elsewhere != int(p) and not move:
                raise Refused(f"todo {t} already sits in phase {elsewhere} of plan {n}; --move takes it out of there")
            for ph in r.data["phases"]:
                ph["todos"] = [x for x in ph["todos"] if x != t]
            phase["todos"].append(t)
        for t in todos:
            ref = f"todo:{int(t)}"
            r.refs = [x for x in r.refs if x != ref] if off else r.refs + [ref] * (ref not in r.refs)
        return self.save(r, "linked", phase=int(p), todos=[int(t) for t in todos], off=off)

    def ready(self, n: int):
        r = self.load(n)
        for i, ph in enumerate(r.data["phases"], 1):
            if not ph["todos"]:
                raise Refused(f"plan {n} cannot be ready: phase {i} has no to-dos")
        return self._status(r, READY, DRAFT)

    def activate(self, n: int):
        self._user_only("activate")
        r = self.load(n)
        if any(x.data.get("status") in (ACTIVE, WAITING) for x in self.all() if x.n != n):
            raise Refused("one plan is active at a time on an environment")
        return self._status(r, ACTIVE, DRAFT, READY)

    def resume(self, n: int):
        self._user_only("continue")
        r = self.load(n)
        r.data["current"] += 1
        return self._status(r, ACTIVE, WAITING)

    def abandon(self, n: int, why: str = ""):
        return self._status(self.load(n), ABANDONED, DRAFT, READY, ACTIVE, WAITING, why=why)

    def _status(self, r, to: str, *allowed: str, **event):
        if r.data.get("status") not in allowed:
            raise Refused(f"plan {r.n} is {r.data.get('status')}, not one that can become {to}")
        r.data["status"] = to
        return self.save(r, "updated", status=to, **event)

    def _phase(self, r, p: int) -> dict:
        try:
            return r.data["phases"][int(p) - 1]
        except IndexError:
            raise Refused(f"plan {r.n} has no phase {p}")

    def _user_only(self, word: str) -> None:
        if self.actor == AGENT:
            raise Refused(f"only the user can {word} a plan: they do it in the viewer")


class Docs(Controller):
    resource = types.Doc


class Reports(Controller):
    resource = types.Report


class Pins(Controller):
    resource = types.Pin


class Rules(Controller):
    resource = types.Rule


class Reminders(Controller):
    resource = types.Reminder


class Questions(Controller):
    resource = types.Question


class Comments(Controller):
    resource = types.Comment


class Agents(Controller):
    resource = types.AgentRow

    def by_session(self, session: str):
        for r in self.all():
            if r.title == session:
                return r
        return self.create(session, status="stopped")


class Nudges(Controller):
    resource = types.Nudge


CONTROLLERS = {c.resource.type: c for c in (Messages, Todos, Works, Plans, Docs, Reports, Pins, Rules, Reminders,
                                            Questions, Comments, Agents, Nudges)}
