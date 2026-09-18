import subprocess
import time

from controllers.base import Controller
from engine.record import Record
from engine.sessions import Sessions
from resources import types
from resources.shapes import LEVELS
from resources.base import AGENT, Refused, check_title




class Messages(Controller):
    resource = types.Message

    def process(self, n: int, part: str, became: str):
        r = self.load(n)
        if part not in r.title and part not in r.brief:
            raise Refused(f"that part is not in message {n}; quote the words it is about")
        return self.section(n, part, became)

    def reply(self, n: int, text: str, file: str = ""):
        lines = (self.load(n).brief or self.load(n).title).strip().split("\n")
        while lines and (lines[0].startswith(">") or not lines[0].strip()):
            lines.pop(0)
        said = "\n".join(lines).strip()
        made = self.comment(n, f"> {said.replace(chr(10), chr(10) + '> ')}\n\n{text}" if said and not text.startswith(">") else text)
        if file:
            CONTROLLERS["comment"](self.record, actor=self.actor).attach(made.n, file)
        return made

    def edit(self, n: int, text: str):
        r = self.load(n)
        if AGENT in r.seen and self.actor != AGENT:
            raise Refused(f"message {n} has been read: leave a new one")
        return self.update(n, brief=text)

    def declare(self, n: int, kind: str):
        return self.update(n, kind=kind)



class Todos(Controller):
    resource = types.Todo

    def assign(self, n: int, to: str = "", off: bool = False):
        if not to and not off:
            raise Refused("assign names an agent with --to, or --off to put the row back")
        return self.update(n, assigned="" if off else to)

    def report(self, n: int, how: str):
        if not self.agent:
            raise Refused("report is a subagent's word — the dispatcher closes a row with done")
        return self.update(n, reported={"agent": self.agent, "dispatcher": self.session, "how": how, "at": time.time()})

    def priority(self, n: int, value: str):
        level = str(value).lower()
        if level not in LEVELS and not level.lstrip("-").isdigit():
            raise Refused(f"a priority is a number or one of {', '.join(LEVELS)}")
        return self.update(n, priority=LEVELS.get(level, int(level) if level.lstrip("-").isdigit() else 0))

    def all(self, deleted: bool = False) -> list:
        return sorted(super().all(deleted), key=lambda t: (-int(t.data.get("priority") or LEVELS["default"]), t.n))


class Works(Controller):
    resource = types.Work

    def create(self, title: str, abstract: str = "", brief: str = "", **data):
        if data.get("todo"):
            row = CONTROLLERS["todo"](self.record, actor=self.actor).load(int(data["todo"]))
            held = row.data.get("assigned") or ""
            if held and held != self.agent:
                raise Refused(f"todo {row.n} is assigned to {held}; nobody else may take it")
        return super().create(title, abstract, brief, **data)


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

    def place(self, n: int, p: int, todos: list, move: bool = False, off: bool = False):
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

    def doc(self, n: int):
        r = self.load(n)
        docs = CONTROLLERS["doc"](self.record, actor=self.actor)
        made = docs.create(r.title, r.abstract, r.brief, **r.data)
        for s in r.sections:
            made = docs.section(made.n, s["title"], s["body"])
        self.complete(n, how=f"became doc {made.n}")
        return made


class Pins(Controller):
    resource = types.Pin

    def promote(self, n: int):
        pin = self.load(n)
        rule = CONTROLLERS["rule"](self.record, actor=self.actor).create(pin.title, pin.abstract, pin.brief, **pin.data)
        self.complete(n, how=f"promoted to rule {rule.n}")
        return rule


class Rules(Controller):
    resource = types.Rule

    def inject(self, n: int):
        return self.update(n, injected=True)

    def uninject(self, n: int):
        return self.update(n, injected=False)


class Reminders(Controller):
    resource = types.Reminder

    def create(self, title: str, abstract: str = "", brief: str = "", until: str = "", **data):
        return super().create(title, abstract, brief, until=until, **data)


class Questions(Controller):
    resource = types.Question


ACCEPT, ADJUST, DECLINE = "Accept", "Adjust", "Decline"
OPEN_SUGGESTIONS = 5


class Suggestions(Controller):
    resource = types.Suggestion

    def create(self, title: str, abstract: str = "", brief: str = "", **data):
        waiting = [s for s in self.all() if not s.completed]
        if len(waiting) >= OPEN_SUGGESTIONS:
            raise Refused(f"{OPEN_SUGGESTIONS} suggestions already wait on the user: {', '.join(str(s.n) for s in waiting)}")
        declined = [s for s in self.all() if s.data.get("decision") == DECLINE.lower() and s.title.lower() == title.lower()]
        if declined and not data.pop("despite", None):
            s = declined[-1]
            raise Refused(f"suggestion {s.n} was declined{': ' + s.outcome if s.outcome else ''}; --set despite=true --set because=\"<what changed>\" to propose it again")
        options = [{"title": ACCEPT, "description": "a to-do is filed from it", "code": ""},
                   {"title": ADJUST, "description": "say what to do differently below; a to-do is filed from your words", "code": ""},
                   {"title": DECLINE, "description": "it is not proposed again", "code": ""}]
        return super().create(title, abstract, brief, options=options, **data)

    def complete(self, n: int, how: str = "", **data):
        word = how.strip().split(":", 1)[0].strip().lower()
        decision = word if word in (ACCEPT.lower(), DECLINE.lower()) else ADJUST.lower() if how.strip() else ""
        self.update(n, decision=decision)
        return super().complete(n, how, **data)

class Comments(Controller):
    resource = types.Comment


class Agents(Controller):
    resource = types.AgentRow

    def by_session(self, session: str):
        for r in self.all():
            if r.title == session:
                return r
        return self.create(session, status="stopped")


class Notifications(Controller):
    resource = types.Notification


class Notices(Controller):
    resource = types.Notice


class Reactions(Controller):
    resource = types.Reaction


class Tools(Controller):
    resource = types.Tool

    def run(self, n: int, *args: str):
        tool = self.load(n)
        project = self.record.root.parent
        done = subprocess.run([*tool.data["entry"].split(), *args], cwd=project, capture_output=True, text=True, timeout=600)
        return {"code": done.returncode, "out": done.stdout, "err": done.stderr}


class Styles(Controller):
    resource = types.Style


class Connections(Controller):
    resource = types.Connection


class Environments(Controller):
    resource = types.Environment

    def create(self, title: str, abstract: str = "", brief: str = "", **data):
        name = check_title(title)
        if any(e.title == name for e in self.all()):
            raise Refused(f"environment {name!r} exists: switch to it")
        made = super().create(name, abstract, brief, **data)
        Record(self.record.root, name)
        return made

    def sessions(self) -> Sessions:
        if not self.session:
            raise Refused("no session to bind: say which with --session")
        return Sessions(self.record.root)

    def switch(self, n: int):
        env = self.load(n)
        holder = self.sessions().holder(env.title)
        if holder and holder != self.session:
            raise Refused(f"environment {env.title!r} is taken by session {holder}: claim it with a reason, or work another")
        self.sessions().bind(self.session, env.title)
        return self.update(n, holder=self.session)

    def claim(self, n: int, why: str):
        env = self.load(n)
        holder = self.sessions().holder(env.title)
        if holder and holder != self.session:
            self.sessions().evict(holder, self.session, env.title, why)
        self.sessions().bind(self.session, env.title)
        return self.update(n, holder=self.session, claimed={"from": holder, "why": why})

    def leave(self, n: int):
        self.sessions().unbind(self.session)
        return self.update(n, holder="")

    def grant(self, n: int, off: bool = False):
        env = self.load(n)
        return self.sessions().grant(self.session, env.title, on=not off)


class Nudges(Controller):
    resource = types.Nudge


CONTROLLERS = {c.resource.type: c for c in (Messages, Todos, Works, Plans, Docs, Reports, Pins, Rules, Reminders, Suggestions,
                                            Questions, Comments, Agents, Notifications, Notices, Reactions, Tools, Styles, Connections, Environments, Nudges)}
